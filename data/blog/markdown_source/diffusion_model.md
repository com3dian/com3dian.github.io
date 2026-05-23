
*Acknowledgement: I am deeply grateful to my friends and colleagues who helped review this manuscript, namely Thijs van der Plas, Jiahao Zhang, Wenbo Jing, and Yingjie Shao.*

Generative diffusion models reframe sample generation as an iterative denoising process: starting from pure Gaussian noise, they learn to reverse a carefully designed forward diffusion that gradually corrupts data.

This blog presents a unified derivation of two foundational approaches---[Denoising Diffusion Probabilistic Models (DDPM)](https://arxiv.org/abs/2006.11239) and [Denoising Diffusion Implicit Models (DDIM)](https://arxiv.org/abs/2010.02502)---tracing them from their variational autoencoder roots. We show how the training objective emerges naturally from the evidence lower bound (ELBO), reducing to a simple noise-prediction loss, and how the sampling procedure can be understood through its connection to score matching. Within this unified view, DDIM arises as a deterministic limit of DDPM, enabling accelerated sampling through a non-Markovian forward process while preserving the same marginal distributions and training objective.

# Prefix

Generative models can be viewed as the processes that sample from an unknown data distribution. In image generation, the data distribution represents all possible images, while in language generation it is the distribution over possible sequences of text. In this blog, we adopt this perspective to re-derive the formalism of a class of image generation models—specifically diffusion models, including denoising diffusion probabilistic models (DDPM) and denoising diffusion implicit models (DDIM)—which form the basis of state-of-the-art systems such as Stable Diffusion and DALL·E.

Intuitively, one might consider a Monte Carlo approach in which samples are drawn from a simple, known distribution and only those consistent with the target data distribution are retained. However, such naive rejection sampling from a simple proposal distribution is infeasible in high dimensions, as the probability of accepting a sample becomes vanishingly small. Suppose we want to generate an RGB image of size $(512, 512)$; the dimensionality of the space is $512 \times 512 \times 3$, and each dimension takes values in $\{0, 1, ..., 255\}$. Since natural images lie on a highly structured, low-dimensional subset of this space, most samples from a simple distribution are very unlikely to correspond to realistic images, making such approaches extremely inefficient.

A more efficient approach is to learn a transformation from a known, easy-to-sample distribution to the target distribution, so that each sample corresponds to a generated data point. Many approaches have been proposed to learn such transformations. For example, in Generative Adversarial Networks (GANs), a generator is trained adversarially against a discriminator to produce samples that match the target distribution, effectively discouraging samples that deviate from the data distribution. In Variational Autoencoders (VAEs), an encoder–decoder architecture is defined within a Bayesian framework, and the model is trained by maximizing a lower bound on the data likelihood. In DDPM, we explicitly define a forward Markov process that gradually transforms data into Gaussian noise, and learn the reverse process to generate data from noise. Training can be interpreted as maximizing a variational lower bound on the data likelihood, similar in the spirit of VAEs.

The following sections introduce diffusion models and their related methods. We first review the ELBO derivation through VAEs (Section VAE), then derive DDPM (Section DDPM) and DDIM (Section DDIM). Finally, we discuss connections to score-based models (Section Score).

When writing this essay, I also read and learned a lot from several blog posts, including:
- [Luo (2022): Understanding Diffusion Models: A Unified Perspective](https://arxiv.org/abs/2208.11970)
- [Lai (2025): Principles of Diffusion Models](https://arxiv.org/abs/2510.21890)
- [Weng (2021): Diffusion Models Blog](lilianweng.github.io/posts/2021-07-11-diffusion-models/)
- [Song et al. (2021): Score-Based Generative Modeling](https://yang-song.net/blog/2021/score/)

## Notations

For convenience of later derivations, we list the required notations below.

### Data and distributions
- $x$, $x_0$: data point drawn from the target distribution  
- $p_{\text{data}}(x)$: unknown target distribution we want to sample from  
- $p_\theta(x)$: learned model distribution parameterized by $\theta$  
- $z$: latent variable drawn from a simple prior  
- $p(z)$: prior distribution, usually $\mathcal{N}(0, I)$  
- $p(x, z)$: joint distribution of $x$ and $z$  
- $p(x \mid z)$: conditional distribution of data given latent variable  

### Variational Inference (VAE)
- $\phi, \theta$: encoder and decoder parameters  
- $q_\phi(z \mid x)$: approximate posterior (encoder)  
- $p_\theta(x \mid z)$: decoder / likelihood  
- $\mu_\phi(x), \sigma_\phi^2(x)$: encoder outputs  

### Distributions and metrics
- $\mathcal{N}(\mu, \Sigma)$: Gaussian distribution  
- $D_{KL}(P \parallel Q)$: KL divergence  
- $\mathbb{E}_q[\cdot]$: expectation under $q$  

### DDPM & diffusion process
- $t$: timestep in $\{1, \dots, T\}$  
- $x_t$: latent variable at timestep $t$  
- $\alpha_t$: noise schedule coefficient  
- $\bar{\alpha}_t = \prod_{s=1}^t \alpha_s$  
- $\epsilon_t \sim \mathcal{N}(0, I)$: Gaussian noise  
- $q(x_t \mid x_{t-1})$: forward process  
- $p_\theta(x_{t-1} \mid x_t)$: learned reverse process  
- $\hat{\epsilon}_\theta(x_t, t)$: noise prediction network  
- $\mu_\theta(x_t, t)$: predicted reverse mean  

### DDIM
- $\sigma_t$: stochasticity parameter  
- $S$: number of sampling steps  
- $\tau$: subset of timesteps  
- $q_\sigma$: DDIM sampling distribution  

### Score-based models
- $\nabla_x \log p(x)$: score function  
- $s_\theta(x, t)$: learned score network  
- $\eta_t$: noise scale  
- $p_t(x_t)$: noisy marginal distribution  
- $\lambda(t)$: weighting function  

### Langevin dynamics
- $\gamma$: step size  
- $z_t \sim \mathcal{N}(0, I)$: injected noise  
- $n$: timestep index for score updates  
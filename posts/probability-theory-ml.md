# Probability Theory for Machine Learning

Probability theory is the mathematical foundation of machine learning. Understanding these concepts is essential for working with ML algorithms, especially in uncertainty quantification and Bayesian methods.

## Why Probability Matters in ML

Machine learning is fundamentally about making predictions under uncertainty:

- Training data is noisy and incomplete
- We need to quantify confidence in predictions
- Many algorithms are based on probabilistic principles

## Basic Probability Concepts

### Sample Space and Events

The **sample space** $\Omega$ is the set of all possible outcomes. An **event** $A$ is a subset of $\Omega$.

$$
P(A) = \frac{\text{favorable outcomes}}{\text{total outcomes}}
$$

### Axioms of Probability

1. $0 \leq P(A) \leq 1$ for any event $A$
2. $P(\Omega) = 1$ (something must happen)
3. If $A$ and $B$ are mutually exclusive: $P(A \cup B) = P(A) + P(B)$

## Conditional Probability

The probability of $A$ given that $B$ has occurred:

$$
P(A|B) = \frac{P(A \cap B)}{P(B)}
$$

### Example: Medical Testing

```python
import numpy as np

# Disease prevalence: 1%
P_disease = 0.01

# Test accuracy: 99%
P_positive_given_disease = 0.99  # True positive rate
P_negative_given_healthy = 0.99   # True negative rate

# What's P(disease | positive test)?
P_healthy = 1 - P_disease
P_positive_given_healthy = 1 - P_negative_given_healthy

# Using Bayes' theorem
P_positive = (P_positive_given_disease * P_disease + 
              P_positive_given_healthy * P_healthy)

P_disease_given_positive = (P_positive_given_disease * P_disease) / P_positive

print(f"Probability of disease given positive test: {P_disease_given_positive:.2%}")
# Output: 50% - even with 99% accurate test!
```

## Bayes' Theorem

The cornerstone of probabilistic inference:

$$
P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}
$$

In ML terminology:

$$
P(\text{hypothesis}|\text{data}) = \frac{P(\text{data}|\text{hypothesis}) \cdot P(\text{hypothesis})}{P(\text{data})}
$$

Where:
- $P(\text{hypothesis}|\text{data})$ is the **posterior**
- $P(\text{data}|\text{hypothesis})$ is the **likelihood**
- $P(\text{hypothesis})$ is the **prior**
- $P(\text{data})$ is the **evidence** (normalization constant)

## Random Variables

A **random variable** $X$ is a function that assigns numerical values to outcomes.

### Discrete Random Variables

Probability mass function (PMF):

$$
P(X = x) = p(x)
$$

Example: Rolling a die

```python
import matplotlib.pyplot as plt

# Fair die
outcomes = np.arange(1, 7)
probabilities = np.ones(6) / 6

plt.bar(outcomes, probabilities)
plt.xlabel('Outcome')
plt.ylabel('Probability')
plt.title('Fair Die PMF')
```

### Continuous Random Variables

Probability density function (PDF):

$$
P(a \leq X \leq b) = \int_a^b f(x) dx
$$

## Important Probability Distributions

### Bernoulli Distribution

Models a single binary trial (coin flip):

$$
P(X = 1) = p, \quad P(X = 0) = 1 - p
$$

```python
from scipy.stats import bernoulli

p = 0.3
samples = bernoulli.rvs(p, size=1000)
print(f"Sample mean: {samples.mean():.3f} (theoretical: {p})")
```

### Gaussian (Normal) Distribution

The most important distribution in ML:

$$
f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
$$

```python
from scipy.stats import norm

mu, sigma = 0, 1
x = np.linspace(-4, 4, 1000)
y = norm.pdf(x, mu, sigma)

plt.plot(x, y)
plt.fill_between(x, y, alpha=0.3)
plt.xlabel('x')
plt.ylabel('Probability Density')
plt.title('Standard Normal Distribution')
```

### Key Properties

- $68\%$ of data within $\mu \pm \sigma$
- $95\%$ of data within $\mu \pm 2\sigma$
- $99.7\%$ of data within $\mu \pm 3\sigma$

## Expected Value and Variance

### Expected Value (Mean)

The average value we expect:

$$
E[X] = \sum_x x \cdot P(X = x) \quad \text{(discrete)}
$$

$$
E[X] = \int_{-\infty}^{\infty} x \cdot f(x) dx \quad \text{(continuous)}
$$

### Variance

Measures spread around the mean:

$$
\text{Var}(X) = E[(X - \mu)^2] = E[X^2] - (E[X])^2
$$

Standard deviation: $\sigma = \sqrt{\text{Var}(X)}$

## Law of Large Numbers

As sample size increases, sample mean converges to expected value:

```python
# Simulate rolling a die
n_rolls = np.arange(1, 10001)
cumulative_mean = np.cumsum(np.random.randint(1, 7, 10000)) / n_rolls

plt.plot(n_rolls, cumulative_mean)
plt.axhline(y=3.5, color='r', linestyle='--', label='Expected Value')
plt.xlabel('Number of Rolls')
plt.ylabel('Average Value')
plt.legend()
plt.title('Law of Large Numbers')
```

## Central Limit Theorem

The sum of many independent random variables approaches a normal distribution:

```python
# Sample means from uniform distribution
sample_sizes = [1, 5, 30, 100]
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

for i, n in enumerate(sample_sizes):
    # Take 10000 samples, each of size n
    samples = np.random.uniform(0, 1, (10000, n))
    sample_means = samples.mean(axis=1)
    
    ax = axes[i // 2, i % 2]
    ax.hist(sample_means, bins=50, density=True, alpha=0.7)
    ax.set_title(f'Sample Size: {n}')
    ax.set_xlabel('Sample Mean')
    ax.set_ylabel('Density')

plt.tight_layout()
```

## Applications in Machine Learning

### Maximum Likelihood Estimation (MLE)

Find parameters that maximize the probability of observed data:

$$
\hat{\theta} = \arg\max_\theta P(\text{data}|\theta)
$$

Example for Gaussian:

```python
# Generate data
true_mu, true_sigma = 5, 2
data = np.random.normal(true_mu, true_sigma, 1000)

# MLE estimates
estimated_mu = data.mean()
estimated_sigma = data.std()

print(f"True: μ={true_mu}, σ={true_sigma}")
print(f"Estimated: μ={estimated_mu:.2f}, σ={estimated_sigma:.2f}")
```

### Naive Bayes Classifier

Uses Bayes' theorem for classification:

$$
P(y|x_1, \ldots, x_n) \propto P(y) \prod_{i=1}^n P(x_i|y)
$$

```python
from sklearn.naive_bayes import GaussianNB
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# Generate data
X, y = make_classification(n_samples=1000, n_features=20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train Naive Bayes
nb = GaussianNB()
nb.fit(X_train, y_train)

print(f"Accuracy: {nb.score(X_test, y_test):.2%}")
```

### Gaussian Processes

Model functions as distributions over functions using multivariate normal distributions.

## Key Takeaways

1. **Bayes' Theorem** is fundamental for updating beliefs with evidence
2. **Normal distribution** appears everywhere due to CLT
3. **MLE** provides a principled way to estimate parameters
4. **Probability quantifies uncertainty** in predictions

## Further Reading

- [Pattern Recognition and Machine Learning (Bishop)](https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/)
- [Probabilistic Machine Learning (Murphy)](https://probml.github.io/pml-book/)
- [Seeing Theory - Visual Introduction to Probability](https://seeing-theory.brown.edu/)

## Practice Problems

1. Prove that $\text{Var}(aX + b) = a^2 \text{Var}(X)$
2. Derive the MLE for Bernoulli distribution parameters
3. Show that the normal distribution is the maximum entropy distribution for given mean and variance

Understanding probability theory deeply will make you a better machine learning practitioner. These concepts form the mathematical language for reasoning about uncertainty and making optimal decisions with incomplete information.

# Building Neural Networks from Scratch

Understanding neural networks at a fundamental level requires implementing one from scratch. Let's build a complete neural network using only NumPy.

## The Mathematical Foundation

A neural network performs a series of linear transformations followed by non-linear activations:

$$
y = \sigma(W_2 \cdot \sigma(W_1 \cdot x + b_1) + b_2)
$$

Where $\sigma$ is an activation function, $W$ are weight matrices, and $b$ are bias vectors.

## Network Architecture

We'll implement a multi-layer perceptron with:
- Input layer: Variable size
- Hidden layers: Configurable
- Output layer: For classification

## Implementation

```python
import numpy as np

class NeuralNetwork:
    def __init__(self, layer_sizes):
        """
        Initialize network with given layer sizes.
        layer_sizes: list of integers representing neurons per layer
        """
        self.weights = []
        self.biases = []
        
        # Initialize weights using He initialization
        for i in range(len(layer_sizes) - 1):
            w = np.random.randn(layer_sizes[i], layer_sizes[i+1]) * \
                np.sqrt(2.0 / layer_sizes[i])
            b = np.zeros((1, layer_sizes[i+1]))
            
            self.weights.append(w)
            self.biases.append(b)
    
    def sigmoid(self, x):
        """Sigmoid activation function"""
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))
    
    def sigmoid_derivative(self, x):
        """Derivative of sigmoid"""
        s = self.sigmoid(x)
        return s * (1 - s)
    
    def relu(self, x):
        """ReLU activation function"""
        return np.maximum(0, x)
    
    def relu_derivative(self, x):
        """Derivative of ReLU"""
        return (x > 0).astype(float)
    
    def forward(self, X):
        """
        Forward propagation through the network.
        Returns activations for each layer.
        """
        self.layer_inputs = [X]
        self.activations = [X]
        
        # Forward through all layers
        for i in range(len(self.weights)):
            # Linear transformation
            z = np.dot(self.activations[-1], self.weights[i]) + self.biases[i]
            self.layer_inputs.append(z)
            
            # Activation (ReLU for hidden, sigmoid for output)
            if i < len(self.weights) - 1:
                a = self.relu(z)
            else:
                a = self.sigmoid(z)
            
            self.activations.append(a)
        
        return self.activations[-1]
    
    def backward(self, X, y, learning_rate=0.01):
        """
        Backpropagation algorithm.
        Updates weights and biases using gradient descent.
        """
        m = X.shape[0]  # Number of samples
        
        # Compute output layer error
        delta = self.activations[-1] - y
        
        # Backpropagate through layers
        for i in range(len(self.weights) - 1, -1, -1):
            # Compute gradients
            dW = np.dot(self.activations[i].T, delta) / m
            db = np.sum(delta, axis=0, keepdims=True) / m
            
            # Update weights and biases
            self.weights[i] -= learning_rate * dW
            self.biases[i] -= learning_rate * db
            
            # Propagate error to previous layer
            if i > 0:
                delta = np.dot(delta, self.weights[i].T) * \
                        self.relu_derivative(self.layer_inputs[i])
    
    def train(self, X, y, epochs=1000, learning_rate=0.01, verbose=True):
        """Train the network"""
        losses = []
        
        for epoch in range(epochs):
            # Forward pass
            predictions = self.forward(X)
            
            # Compute loss (binary cross-entropy)
            loss = -np.mean(y * np.log(predictions + 1e-8) + 
                           (1 - y) * np.log(1 - predictions + 1e-8))
            losses.append(loss)
            
            # Backward pass
            self.backward(X, y, learning_rate)
            
            if verbose and epoch % 100 == 0:
                print(f"Epoch {epoch}, Loss: {loss:.4f}")
        
        return losses
    
    def predict(self, X):
        """Make predictions"""
        return self.forward(X)
```

## Training Example: XOR Problem

The XOR problem is a classic test for neural networks:

```python
# XOR dataset
X = np.array([[0, 0],
              [0, 1],
              [1, 0],
              [1, 1]])

y = np.array([[0],
              [1],
              [1],
              [0]])

# Create network: 2 inputs -> 4 hidden -> 1 output
nn = NeuralNetwork([2, 4, 1])

# Train
losses = nn.train(X, y, epochs=5000, learning_rate=0.5)

# Test
predictions = nn.predict(X)
print("Predictions:")
for i, pred in enumerate(predictions):
    print(f"Input: {X[i]}, Predicted: {pred[0]:.4f}, Actual: {y[i][0]}")
```

## Gradient Descent Visualization

The loss function decreases over time as gradient descent finds the optimal weights:

$$
W_{new} = W_{old} - \alpha \nabla_W L
$$

Where $\alpha$ is the learning rate and $\nabla_W L$ is the gradient of the loss.

## Key Concepts Learned

1. **Forward Propagation**: Computing predictions from input to output
2. **Backpropagation**: Computing gradients using the chain rule
3. **Gradient Descent**: Updating weights to minimize loss
4. **Activation Functions**: Adding non-linearity to the network

## Improvements and Extensions

This basic implementation can be extended with:

- **Batch/Mini-batch training**: Update weights on subsets of data
- **Different optimizers**: Adam, RMSprop, Momentum
- **Regularization**: L1/L2, Dropout
- **Different architectures**: CNNs, RNNs, Transformers

## Conclusion

Building a neural network from scratch provides deep insights into how deep learning actually works. Understanding these fundamentals is crucial before using high-level frameworks like TensorFlow or PyTorch.

## References

- [Nielsen's Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/)
- [Goodfellow et al., Deep Learning Book](https://www.deeplearningbook.org/)

# AI Skin Prediction Project - Model Training Configuration

● **Batch Size**: 32

Balances gradient estimation stability and computational efficiency during training.

● **Epochs**: 50

Number of training iterations used to train the model on the dataset.

● **Early Stopping (Patience)**: 10

Training stops automatically if validation performance stops improving, preventing overfitting.

● **Loss Function**: Categorical Cross-Entropy

Used for multi-class classification to measure the difference between predicted and actual labels.

● **Optimizer**: Adam Optimizer

Adaptive optimization algorithm used to update model weights efficiently.

● **Learning Rate**: 0.001

Controls how quickly the model updates its weights during training.

● **Implementation Framework**:

Model implemented using:

**TensorFlow**

**Keras deep learning API**

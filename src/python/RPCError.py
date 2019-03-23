class InvalidAlgorithm(Exception):
    def __init__(self, algo, message):
        self.algo = algo
        self.message = message

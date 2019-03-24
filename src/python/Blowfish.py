import os
from Crypto.Cipher import Blowfish
from Crypto import Random

class BlowfishCipher:
    # def __init__(self, key, iv=None):
    #     self.__cipher = Blowfish.new(key, Blowfish.MODE_CBC, self.__iv)

    def __add_pad(self, chunk):
        """ Return a chunk with padding added (ISO 10126). """
        bs = Blowfish.block_size
        padding = bs - (len(chunk) % bs)
        for idx, i in enumerate(range(padding), start=1):
            chunk += os.urandom(1) if idx != padding else str(padding).encode()
        return chunk

    def __del_pad(self, chunk):
        """ Return a chunk with padding removed (ISO 10126). """
        return chunk[:-int(chunk[-1:])]

    def encrypt(self, key, originalFile, output):
        infile = open(originalFile, 'rb')
        outfile = open(output, 'wb')
        # encode = ''
        chunk_size = 720
        iv = Random.new().read(Blowfish.block_size)
        chunk = infile.read(chunk_size)
        cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)

        if len(chunk) != chunk_size:
            encode = iv + cipher.encrypt(self.__add_pad(chunk))
        else:
            encode = iv + cipher.encrypt(chunk)
        outfile.write(encode)

        while True:
	    	chunk = infile.read(chunk_size)
	    	if not chunk:
		        break
	    	else:
	    		if len(chunk) != chunk_size:
	    			encode = cipher.encrypt(self.__add_pad(chunk))
		        else:
		        	encode = cipher.encrypt(chunk)

			outfile.write(encode)
		
        infile.close()
        outfile.close() 

    def decrypt(self, key, encryptedFile, output):
        """ Return a decrypted chunk. """
        chunk_size = 720
        bs = Blowfish.block_size

        ifile = open(encryptedFile,'rb')
        ofile = open(output,'wb')

        iv = ifile.read(bs)
        cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)

        while True:
        	chunk = ifile.read(chunk_size)
        	encode = ''
        	if not chunk:
        		break
        	else:
        		if len(chunk) != chunk_size:
        			encode = self.__del_pad(cipher.decrypt(chunk))
        		else:
        			encode = cipher.decrypt(chunk)
        	ofile.write(encode)

        ifile.close()
        ofile.close()

a = BlowfishCipher()
a.encrypt('12345678', 'testfile.zip', 'test.enc')
a.decrypt('12345678', 'test.enc', 'hbeat12345.zip')
print('done')
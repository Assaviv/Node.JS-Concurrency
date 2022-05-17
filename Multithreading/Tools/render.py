# Read in the file
with open('song.txt', 'r') as file :
  filedata = file.read()

# Remove enter after dot
filedata = filedata.replace('.\n', '.')

# Write the file out again
with open('song.txt', 'w') as file:
  file.write(filedata)
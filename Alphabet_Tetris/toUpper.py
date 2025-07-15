import os

def changeDirectory():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

def main():
    validLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    maxLen = 0
    with open('./words.txt', 'r', encoding='utf-8') as file: 
        with open('./words-uppercase.txt', 'w', encoding='utf-8') as output:
            for line in file: 
                if line != '':
                    tmpLine = line.strip().upper()
                    flag = False
                    if len(tmpLine) < 3:
                        continue
                    for letter in tmpLine:
                        if letter not in validLetters:
                            flag = True
                            break
                    if not flag:
                        output.write(tmpLine + '\n')
                        maxLen = max(maxLen, len(tmpLine))
    print(maxLen)


if __name__ == "__main__":
    changeDirectory()
    main()
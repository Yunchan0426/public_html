#include <iostream>
#include <vector>
#include <string>

class TrieNode {
public:
    TrieNode* children[26];
    bool EOW;

    TrieNode() {
        EOW = false;
        for (int i = 0; i < 26; i++) {
            children[i] = nullptr;
        }
    }
};

void insert(TrieNode* root, const std::string& word) {
    TrieNode* curr = root;

    for (char c : word) {
        if (curr->children[c -'a'] == nullptr) {
            TrieNode* newNode = new TrieNode();

            curr->children[c - 'a'] = newNode;
        }
        curr = curr->children[c-'a'];
    }
    curr->EOW = true;
};

bool search(TrieNode* root, const std::string& word) {
    TrieNode* curr = root;

    for (char c : word) {
        if (curr->children[c - 'a'] == nullptr) {
            return false;
        }
        curr = curr->children[c - 'a'];
    }
    return curr->EOW;
};

bool profix(TrieNode*root, const std::string& word) {
    TrieNode* curr = root;

    for (char c : word) {
        int index = c - 'a';
        if (curr->children[index] == nullptr) {
            return false;
        }
        curr = curr->children[index];
    }
    return true;
};

int main() {
    TrieNode* root = new TrieNode();
    vector<string> arr = {};

    for (const string &s : arr) 
}


/*#include <iostream>

class TrieNode
{
    TrieNode *chrn[26];
    bool EOW;

    TrieNode()
    {
        EOW = false;
        for (int i = 0; i < 26; i++)
            chrn[i] = nullptr;
    }
};

class Trie
{
private:
    TrieNode *root;

public:
    Trie()
    {
        root = new TrieNode();
    }
};*/

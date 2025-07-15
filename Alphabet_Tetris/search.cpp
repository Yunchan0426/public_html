#include <iostream>
#include <vector>
#include <string>

using namespace std;

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
        if (curr->children[c - 'a'] == nullptr) {
            TrieNode* newNode = new TrieNode();

            curr->children[c - 'a'] = newNode;
        }
        curr = curr->children[c - 'a'];
    }
    curr->EOW = true;
};

bool search(TrieNode* root, const std::string& word) {
    TrieNode* curr = root;

    for (char c : word) { // for all letter c in word (with conserving the order of `word`)
        if (curr->children[c - 'a'] == nullptr) { // if letter c doesn't exist in the children of curr
            return false; // return false
        }
        curr = curr->children[c - 'a']; // if not, move to the corresponding children, and do the loop again
    }
    return curr->EOW;
};

bool profix(TrieNode* root, const std::string& word) {
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
    vector<string> ;


}
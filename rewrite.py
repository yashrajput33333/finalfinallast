import sys
def rewrite(commit):
    if commit.author_name == b'Akansha2004pandey':
        commit.author_name = b'yashrajput33333'
        commit.author_email = b'yashrajput33333@gmail.com'
    if commit.committer_name == b'Akansha2004pandey':
        commit.committer_name = b'yashrajput33333'
        commit.committer_email = b'yashrajput33333@gmail.com'

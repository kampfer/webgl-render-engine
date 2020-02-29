# https://help.github.com/en/github/using-git/changing-author-info

#!/bin/sh

git filter-branch --env-filter '

OLD_EMAIL="liaowei02@baidu.com"
CORRECT_NAME="liaowei"
CORRECT_EMAIL="l.w.kampfer@gmail.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
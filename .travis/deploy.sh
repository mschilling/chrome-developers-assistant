#!/bin/bash
echo "Executing deploy script..."
if [ -z "$1" ]; then
    echo "No alias/project id supplied as argument..."
    echo "Exiting."
    exit 1
fi
echo "Branch: $TRAVIS_BRANCH"
if [ $TRAVIS_BRANCH == "develop" ]; then
    echo "Branch is develop..."
    echo "Checking on PR..."
    echo "Pull Request: $TRAVIS_PULL_REQUEST"
    if [ $TRAVIS_PULL_REQUEST == false ]; then
        echo "Initiate deployment :)"
        echo "Firebase deploy disabled"
#        firebase use $1 --token "${FIREBASE_API_TOKEN}"
#        firebase deploy --token "${FIREBASE_API_TOKEN}" --only functions --non-interactive
#        firebase deploy --token "${FIREBASE_API_TOKEN}" --only hosting --non-interactive
    else
        echo "Is a pull request..."
        echo "Not deploying."
    fi
else
    echo "Not develop branch..."
    echo "Not deploying."
fi

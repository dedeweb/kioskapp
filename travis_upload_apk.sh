#!/bin/sh
#https://gist.github.com/willprice/e07efd73fb7f13f917ea
#https://medium.com/@daggerdwivedi/push-your-apk-to-your-github-repository-from-travis-11e397ec430d
built_apk_dir="$TRAVIS_BUILD_DIR/platforms/android/build/outputs/apk"

copy_files() {
  cp -R $built_apk_dir $TRAVIS_BUILD_DIR/apk/ 
}

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
  git remote set-url origin https://${GITHUB_KEY}@github.com/dedeweb/kioskapp.git > /dev/null 2>&1
  git checkout master
}

commit_apk_files() {
  git add apk
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER [skip ci]"
}

upload_files() {
  git push --quiet
}

if [ ! -f $built_apk_dir/android-armv7-release-unsigned.apk ] || [ ! -f $built_apk_dir/android-x86-release-unsigned.apk ]; then
    echo -e "Error : build file not present :( \n in $built_apk_dir"
    exit 1
fi

copy_files
setup_git
commit_apk_files
upload_files

exit 0
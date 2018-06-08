#!/bin/sh

if [ -d "platforms/android" ]; then

echo "copying extra gradle configuration to android directory"
cp resources/build-extras.gradle platforms/android/build-extras.gradle

#echo "OVERWRITING GENERATED build.gradle IN PROJECT, AS LONG AS WE DO    NOT FIND A BETTER WAY"
#cp resources/build.gradle platforms/android/build.gradle

fi

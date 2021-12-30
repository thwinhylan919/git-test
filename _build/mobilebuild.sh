#!/bin/bash
######################## very important instruction ###################################
#if you abort the build anyway in between when the build is running remove the "mylock" file from the /var/tmp directory
#you can use this command below to remove it

rm -rf /var/tmp/mylock
################################# ios build part ###########################################
removing_and_copying_directories_for_ios(){
	rm -rf ./apps/ios/workspace_installer/zigbank/platforms/ios/www/{components,framework,images,index,resources,partials,index.html,pages,sw.js,manifest.json,extensions,build.fingerprint,json}
	rm -rf ./mobilebuild/dist/{build.txt,pages}
	cp -rf ./mobilebuild/dist/* ./apps/ios/workspace_installer/zigbank/platforms/ios/www/
}


checking_out_base_project_for_ios(){
	echo "checking out base project"
	cd ./apps/ios/workspace_installer
	rm ./zigbank/platforms/ios/app.plist
	##svn update
	cd ../../../
}


################################start of the ios build ###################
ios_build(){
	updating_exporting_ui ios
	export OBDX_IS_GRUNT=true
	/usr/local/bin/node --max_old_space_size=5120 /usr/local/bin/grunt mobilebuild --platform=ios && /usr/local/bin/node component.js && /usr/local/bin/node integrity-generator.js && /usr/local/bin/node listComponents.js
	EXIT_CODE=$?
	if [ $EXIT_CODE -eq 0 ]; then
	cd ../..
	cp -rf ./axe.js ./mobilebuild/dist/
	cp -rf ./index.html ./mobilebuild/dist/home.html
	#checking_out_base_project_for_ios
	removing_and_copying_directories_for_ios
	cd apps/ios/workspace_installer/zigbank/platforms/ios/ZigBank
	set_ios_url
	cd ..
	xcodebuild -scheme ZigBank archive -archivePath ./ZigBank.xcarchive && xcodebuild -exportArchive -archivePath ./ZigBank.xcarchive -exportPath ../ZigBank.ipa -exportOptionsPlist ./exportOptionPlist.plist
    xcode_build_status=$?
	if [ $xcode_build_status -ne 0 ]
	then
	    echo "xcode build faild"
	    rm $LOCK
	    exit 1
	fi
	rm app.plist
    cd ..
	curl -T ./ZigBank.ipa/ZigBank.ipa ftp://10.180.33.218/OBDX191/ios/ --user obdxuser:welcome1
	echo "OAM BUILD UPLOADED"
    copy_ipa=$?
	if [ $copy_ipa -ne 0 ]
	then
	    echo "copying ipa failed"
	    rm $LOCK
	    exit 1
	fi

	cd ../../../
	#rm -rf ios

	echo "done!";
	rm $LOCK
	exit 0
	else
	echo "failure!";
	rm $LOCK
	exit 1
	fi

}



###################################### android build part #########################################################
###################################################################################################################
updating_exporting_ui()
{
	cd ../
	rm -rf dist destInt
	svn update
	cd ./_build
	rm -rf grunt

	#related to ui framework changes of sslStatus 
	svn revert ../framework/js/constants/constants.js
	if [[ $1 == "android" ]]; then
		local ssl_status="disabled"
	elif [[ $1 == "ios" ]]; then
		local ssl_status="enabled"	
	fi
	sed -i -E "s|<SSLStatus>|$ssl_status|g" ../framework/js/constants/constants.js
	sed -i -E "s|<Authenticator>|OBDXAuthenticator|g" ../framework/js/constants/constants.js
	echo running build task
}

removing_and_copying_directories_for_android()
{
	rm -rf ./apps/android/zigbank/platforms/android/app/src/main/assets/www/{components,corporate,framework,images,index,retail,resources,partials,index.html,pages,sw.js,manifest.json,extensions,build.fingerprint,json}
	rm -rf ./mobilebuild/dist/{build.txt,pages}
	cp -rf ./mobilebuild/dist/* ./apps/android/zigbank/platforms/android/app/src/main/assets/www/
}

checking_out_base_project_for_android(){
	echo "checking out base project"
	rm -rf ./apps/android/zigbank/platforms/android/build
	rm -rf ./apps/android/zigbank/platforms/android/app/build
	cd ./apps/android/zigbank
	rm ./platforms/android/customizations/src/main/res/values/app.properties.xml
  	svn up
	cd ../../../
}

####################################### android build starts from here ########################################################
android_build(){
	updating_exporting_ui android
	export OBDX_IS_GRUNT=true
	node --max_old_space_size=5120 $(type -p grunt) mobilebuild --platform=android && node component.js && node integrity-generator.js && node listComponents.js
	EXIT_CODE=$?
	if [ $EXIT_CODE -eq 0 ]; then
	cd ../..
	cp -rf ./axe.js ./mobilebuild/dist/
	cp -rf ./index.html ./mobilebuild/dist/home.html
	checking_out_base_project_for_android
	removing_and_copying_directories_for_android
	cd ./apps/android/zigbank/platforms/android
	set_android_url
	chmod 777 ./gradlew
	./gradlew clean
	./gradlew -Dhttp.proxyHost=www-proxy-idc.in.oracle.com -Dhttp.proxyPort=80 -Dhttps.proxyHost=www-proxy-idc.in.oracle.com -Dhttps.proxyPort=80  assembleRelease && curl -T ./app/build/outputs/apk/release/app-release.apk ftp://10.180.33.218/OBDX191/android/android-release-9Apr.apk --user obdxuser:welcome1
	echo "OAM BUILD UPLOADED"
	curl -T ./obdxwear/build/outputs/apk/release/obdxwear-release.apk ftp://10.180.33.218/OBDX191/android/obdxwear-release.apk --user obdxuser:welcome1
	echo "OBDXWEAR OAM BUILD UPLOADED"
	gradle_build_status=$?
	if [ $gradle_build_status -ne 0 ]
	then
	    echo "gradle build faild"
	    exit 1
	fi
	echo "done!";
	rm $LOCK
	exit 0
	else
	echo "failure!";
	rm $LOCK
	exit 1
	fi
}
####################################### android build ends here ########################################################

####################################### android dev build starts from here ################################################
android_dev(){
	updating_exporting_ui android
	node component-sass.js
	node --max_old_space_size=5120 $(type -p grunt) mobile-dev --platform=android && node component.js && node listComponents.js --dev
	EXIT_CODE=$?
	if [ $EXIT_CODE -eq 0 ]; then
	cd ..
	mv "destInt" "dist"
	cd ..
	cp -rf ./axe.js ./mobilebuild/dist/
        cp -rf ./mobilebuild/index.html ./mobilebuild/dist/home.html
	checking_out_base_project_for_android
	removing_and_copying_directories_for_android
	cd ./apps/android/zigbank/platforms/android
	set_android_url
chmod 777 ./gradlew
	./gradlew clean
	./gradlew -Dhttp.proxyHost=www-proxy-idc.in.oracle.com -Dhttp.proxyPort=80 -Dhttps.proxyHost=www-proxy-idc.in.oracle.com -Dhttps.proxyPort=80 assembleDebug && curl -T ./app/build/outputs/apk/debug/app-debug.apk ftp://10.180.33.218/OBDX191/android/android-debug.apk --user obdxuser:welcome1
	echo "OAM BUILD UPLOADED"
#	curl -T ./obdxwear/build/outputs/apk/debug/obdxwear-debug.apk ftp://10.180.33.218/OBDX183/android/obdxwear-debug.apk --user obdxuser:welcome1
	echo "OBDXWEAR OAM BUILD UPLOADED"
	gradle_build_status=$?
	if [ $gradle_build_status -ne 0 ]
	then
	    echo "gradle build faild"
	    exit 1
	fi
	echo "done!";
	rm $LOCK
	exit 0
	else
	echo "failure!";
	rm $LOCK
	exit 1
	fi
}
####################################### android dev build ends here #######################################################


####################################### android dev build starts from here ################################################
test_dev(){
	updating_exporting_ui
	export OBDX_IS_GRUNT=true
	node --max_old_space_size=5120 $(type -p grunt) mobilebuild --platform=android
	EXIT_CODE=$?
	if [ $EXIT_CODE -eq 0 ]; then
	cd ../..
	cp -rf ./axe.js ./mobilebuild/dist/
	checking_out_base_project_for_android
	removing_and_copying_directories_for_android
	cd ./apps/android/obdx/platforms/android
	set_android_url
	chmod 777 ./gradlew
	./gradlew clean
	./gradlew assembleDebug && curl -T ./build/outputs/apk/debug/android-debug.apk ftp://10.180.33.218/OBDX183/android/android-test.apk --user obdxuser:welcome1
	echo "OAM BUILD UPLOADED"
	curl -T ./obdxwear/build/outputs/apk/debug/obdxwear-debug.apk ftp://10.180.33.218/OBDX183/android/obdxwear-test.apk --user obdxuser:welcome1
	echo "OBDXWEAR OAM BUILD UPLOADED"
	gradle_build_status=$?
	if [ $gradle_build_status -ne 0 ]
	then
	    echo "gradle build faild"
	    exit 1
	fi
	echo "done!";
	rm $LOCK
	exit 0
	else
	echo "failure!";
	rm $LOCK
	exit 1
	fi
}
####################################### android dev build ends here #######################################################


########################### Utility functions to read from mobile_properties.json and modify app.properties.xml(android) and app.plist(ios) ##########################



## common utilities

set_ios_url() {
	sed "s|@@SERVER_TYPE|${SERVER_TYPE}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@KEY_SERVER_URL|${KEY_SERVER_URL}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@KEY_OAM_URL|${KEY_OAM_URL}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@WEB_URL|${WEB_URL}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@CHATBOT_ID|${CHATBOT_ID}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@CHATBOT_URL|${CHATBOT_URL}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist

	sed "s|@@KEY_OAUTH_PROVIDER_URL|${KEY_OAUTH_PROVIDER_URL}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@LOGIN_SCOPE|${LOGIN_SCOPE}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@OFFLINE_SCOPE|${OFFLINE_SCOPE}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@X_TOKEN_TYPE|${X_TOKEN_TYPE}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist

	sed "s|@@APP_CLIENT_ID|${APP_CLIENT_ID}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@APP_DOMAIN|${APP_DOMAIN}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist

	sed "s|@@EXTENSION_CLIENT_ID|${EXTENSION_CLIENT_ID}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@EXTENSION_DOMAIN|${EXTENSION_DOMAIN}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist

	sed "s|@@WATCH_CLIENT_ID|${WATCH_CLIENT_ID}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@WATCH_DOMAIN|${WATCH_DOMAIN}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist

	sed "s|@@SNAPSHOT_CLIENT_ID|${SNAPSHOT_CLIENT_ID}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@SNAPSHOT_DOMAIN|${SNAPSHOT_DOMAIN}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
}

set_android_url() {
	cd ./customizations/src/main/res/values
	sed "s|@@SERVER_TYPE|${SERVER_TYPE}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@KEY_SERVER_URL|${KEY_SERVER_URL}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@KEY_OAM_URL|${KEY_OAM_URL}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@WEB_URL|${WEB_URL}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@CHATBOT_ID|${CHATBOT_ID}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@CHATBOT_URL|${CHATBOT_URL}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml

	sed "s|@@KEY_OAUTH_PROVIDER_URL|${KEY_OAUTH_PROVIDER_URL}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@LOGIN_SCOPE|${LOGIN_SCOPE}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@OFFLINE_SCOPE|${OFFLINE_SCOPE}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@X_TOKEN_TYPE|${X_TOKEN_TYPE}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml

	sed "s|@@APP_CLIENT_ID|${APP_CLIENT_ID}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@APP_DOMAIN|${APP_DOMAIN}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml

	sed "s|@@WATCH_CLIENT_ID|${WATCH_CLIENT_ID}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@WATCH_DOMAIN|${WATCH_DOMAIN}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml

	sed "s|@@SNAPSHOT_CLIENT_ID|${SNAPSHOT_CLIENT_ID}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@SNAPSHOT_DOMAIN|${SNAPSHOT_DOMAIN}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	cd ../../../../../
}

removeQuotes(){
	argument1=$1
	temp="${argument1#\"}"
	temp="${temp%\,}"
	temp="${temp%\"}"
	echo $temp
}

getKey(){
	key=$1
	VALUE=$(cat mobile_properties.json | grep $key | cut -d ":" -f2-)
	temp=$(removeQuotes $VALUE)
	echo $temp
}

###################################################################################################################################################################

## first block

LOCK=/var/tmp/mylock
if [ -f $LOCK ]; then            # 'test' -> race begin
  echo "Job is already running"
  echo "if the job is not running this means that the previous build was aborted. please remove the mylock file from /var/tmp directory"
  exit 6
fi
touch $LOCK                      # 'set'  -> race end
if [ $1 == ios ];then
	ios_build
elif [ $1 == android ];then
	android_build
elif [ $1 == android-dev ];then
	android_dev
elif [ $1 == test ];then
	test_dev
else
	echo "type the right argument"
fi
rm $LOCK

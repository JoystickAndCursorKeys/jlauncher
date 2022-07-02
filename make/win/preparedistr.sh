app=arcadelaunchy

mkdir distr/tmp_win
rm -Rf distr/tmp_win/$app
(cd distr/tmp_win; pwd; mkdir $app; cd $app ; unzip ../../../distr_bin/electron-v18.3.4-win32-x64.zip)
mv distr/tmp_win/$app/electron.exe distr/tmp_win/$app/${app}.exe

mkdir distr/tmp_win/$app/resources/app
rm         distr/tmp_win/$app/resources/default_app.asar
rm -Rf     distr/tmp_win/$app/resources/app/*
mkdir distr/tmp_win/$app/resources/app/conf
cp -R conf/* distr/tmp_win/$app/resources/app/conf
mkdir distr/tmp_win/$app/resources/app/res
cp -R res/*  distr/tmp_win/$app/resources/app/res
cp *.js distr/tmp_win/$app/resources/app
cp package.json distr/tmp_win/$app/resources/app

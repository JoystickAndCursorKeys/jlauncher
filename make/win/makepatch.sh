app=arcadelaunchy




mkdir distr/tmp_win_patch
rm -Rf distr/tmp_win_patch/$app
mkdir distr/tmp_win_patch/$app
mkdir distr/tmp_win_patch/$app/resources
mkdir distr/tmp_win_patch/$app/resources/app
rm -Rf     distr/tmp_win_patch/$app/resources/app/*
mkdir distr/tmp_win_patch/$app/resources/app/conf
cp -R conf/* distr/tmp_win_patch/$app/resources/app/conf
mkdir distr/tmp_win_patch/$app/resources/app/res
cp -R res/*  distr/tmp_win_patch/$app/resources/app/res
cp *.js distr/tmp_win_patch/$app/resources/app
cp package.json distr/tmp_win_patch/$app/resources/app

curd=`pwd`; (cd distr/tmp_win_patch ; zip -r $curd/distr/${app}_win_p`date "+%Y%m%d"`.zip $app )

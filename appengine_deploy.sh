git reset --hard
git pull

npm i

echo "Enter your bucket storage name: "
read name
sed -i -e s/bucket-pastes-name/"$name"/g app.yaml

gcloud app deploy

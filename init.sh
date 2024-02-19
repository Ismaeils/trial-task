echo "## Initialisation script starting..."
npm install
npm run build
rm -rf node_modules
npm install --production
echo "## Applying prisma migration schema..."
npx prisma migrate deploy
echo "## Starting the server..."
exec npm run start
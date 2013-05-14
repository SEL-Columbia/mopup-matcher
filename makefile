compile:        
	./node_modules/node-sass/bin/node-sass --output-style=compressed ./public/sass/app.scss ./public/css/app.css
	./node_modules/node-sass/bin/node-sass --output-style=compressed ./public/sass/progress.scss ./public/css/progress.css
	#./node_modules/coffee-script/bin/coffee -bw -o ./public/js -c ./public/coffee

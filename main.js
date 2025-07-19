const readline = require('readline');
const process = require('process');
const http = require('http');
const fs = require('fs');
const mime = require('mime-types');

// Icons
const folder_ico = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAB2AAAAdgFOeyYIAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAR9JREFUOI3Fjz8vQ2EUxn/n9ZbbxuBPO0p0EBG1Ed/BzuBbmKwSX8BisAghkVj4ABISNpE0DAaDvcEV7b3Nbfu+x9BUSsR1B/GMz3Oe3zkH/lsSn48fIrrU5yWK7haGww2Zp50OuBiLgfw32bWIbKtq3G+qaFQohmcySwvAdm2DLS0jJuifXQD2PiHV03k+pVmTNXjZ+gDkJtexpZW0a6HdwEVVfOO22LMsgBmcAJ/gwkvwP7ytDpOfwwSV1fb96CKGK9vLfL2Kxo+pR4gdASgDZVWmugBVfPSQ/sJXGBwbAFwdfDMzwKscGADfes1cBm6GZjbvDBIInXrmtir7AMbkpwdAM9a9yxl7BGAlKKtq8muCgOLeTqSy85Rx6x/pHUzqYwXSZDsDAAAAAElFTkSuQmCC';
const file_ico = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAABvAAAAbwHxotxDAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAFdQTFRF////u8PRu8XR4ubwucPQ0dvn4ufw1N3o0dvnztnm0trj4ufw2+Ls1d3pnay6n627n667pbLAv8nVydXjzNTf0Nrn0dji1d7p197o3eLs3uPt4ebw4ufwpvSf8gAAAA50Uk5TAHt7e3y3wODn7/n8/f7bGpwZAAAAXElEQVQYV53NSQ6AIAxA0SrOswiI0PufU8GWGBM3/l1f2hQARI+hLgOqijOauXjBxEJwrNOSPwG93loGJ6+c1wl4pyFQYUFKhTWBNTH7DT9PVPjLkLpBDDs1lgAn0loPE8phVs8AAAAASUVORK5CYII=';

// Properties
const hostname = '127.0.0.1'; // localhost
const port = process.argv.length > 3? process.argv[3]: 3000;
const base_path = process.argv.length > 2? process.argv[2]: 'C:/documents';

// Enable raw mode on stdin
process.stdin.setRawMode(true);
console.log("==============================================================");
console.log("Starting Server...\n");

const server = http.createServer((req, res) => {
	let filepath = base_path + req.url;
	
	if (fs.existsSync(filepath)){
		console.log('File: '+filepath);
		const stats = fs.statSync(filepath);
		if (stats.isDirectory()){
			res.statusCode = 200; // OK status
			res.setHeader('Content-Type', 'text/html'); // Set content type
			
			let src = '<html><h3>'+filepath+'</h3><a href="'+(req.url.lastIndexOf('/') <= 0? '../': req.url.substr(0, req.url.lastIndexOf('/')))+'">[Voltar]</a><br/><br/>';
			let lsrc = '';
			let list = fs.readdirSync(filepath);
			list.forEach(function(item){
				let path = item;
				if (req.url!='' && req.url!='/' && req.url!='\\'){
					path = req.url +'/'+ item;
				}
				let cl = '<a href="'+path+'"><img width="16" src="'+(fs.statSync(base_path+'/'+path).isDirectory()? folder_ico: file_ico)+'" style="margin-right:4px;"/>'+item+'</a><br/>';
				if (item=='index.html'){
					src += cl+'<hr/>';
				}
				else {
					lsrc += cl;
				}
			});
			src = src+lsrc+'</html>';
			
			res.end(src); // Send Data
		}
		else {
			res.statusCode = 200; // OK status
			res.setHeader('Content-Type', mime.lookup(filepath)); // Set content type
			res.end(fs.readFileSync(filepath)); // Send Data
		}
	}
	else {
		res.statusCode = 404; // Not Found
		res.setHeader('Content-Type', 'text/html');
		res.end('<h2>File Not Found!</h2>');
	}
});

/*
server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
*/

server.listen(port, () => {
	console.log(`File server running at http://localhost:${port}/`);
});



/*
	Program Abortion by Key press
*/

// Listen for keypress events
process.stdin.on('keypress', (str, key) => {
	if (key.name === 'escape'){
		console.log("Closing Server...");
		process.exit(0);
	}
});

// Start emitting keypress events
readline.emitKeypressEvents(process.stdin);


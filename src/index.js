import Parser from './parser.js';

Parser.parse("https://mmajunkie.usatoday.com/2018/04/derrick-lewis-vs-francis-ngannou-booked-ufc-226-las-vegas")
   .then(ref => {
	const element = document.createElement('div');
	element.innerHTML = `<pre>${ref}</pre>`;
	document.body.appendChild(component());
   })
   .catch(e => {
	console.error('Processing failed');

	if (e.message)
	    console.error(e.message);
   });

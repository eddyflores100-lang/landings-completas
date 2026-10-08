const select=document.querySelector('#sector');
const cards=[...document.querySelectorAll('[data-sector]')];
select.addEventListener('change',()=>{let count=0;for(const card of cards){card.hidden=select.value!=='all'&&card.dataset.sector!==select.value;if(!card.hidden)count++}document.querySelector('#results').textContent=`${count} ${count===1?'plantilla disponible':'plantillas disponibles'}`});

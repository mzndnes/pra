const poke = document.getElementById('pokedex');
const sbar = document.getElementById('searchBar');

let stext='';
let pokedex=[];
sbar.addEventListener('keyup',(e)=>{
    
    if (e.keyCode>=32 && e.keyCode<=126)
        stext=stext+String.fromCharCode(e.keyCode);
    stext=stext.toLowerCase();
    const filtered=pokedex.filter(poke=>{
        return poke.name.toLowerCase().includes(stext);
    });    
    displaypokedex(filtered); 
    // console.log(filtered);
});
const pcache={};

const fetchpokedex = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=700`;
    const res= await fetch(url);
    const data= await res.json();
    pokedex=data.results.map(
        (rst,idx)=>
            ({
                name:rst.name,
                id:idx+1,
                image:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idx+1}.png`
                              
            }));

    // data.results.map(
    //     async (rst,idx)=>
    //         {
    //             let pobj={};
    //             pobj.name=rst.name;
    //             pobj.id=idx+1;
    //             pobj.image=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idx+1}.png`
                
    //             const surl=`https://pokeapi.co/api/v2/pokemon-species/${idx+1}`;
    //             const sres= await fetch(surl);
    //             const sdata= await sres.json();
    //             // console.log(sdata);
                
    //             pobj.habitat=sdata.habitat.name;
                    
    //             pokedex.push(pobj);  
                              
            // });
    // console.log(pokedex);
    displaypokedex(pokedex); 
};

const displaypokedex = (pokedex) => {
    
    const htmlString = pokedex.map(
            (p) => `
        <li class="card" onclick="disDetail(${p.id})">
            <img class="card-image" src="${p.image}"/>
            <h2 class="card-title">${p.id}. ${p.name}</h2>
            
        </li>`
        ).join('');
    // console.log(pokedex);
    poke.innerHTML = htmlString;
};

const disDetail=async (id)=>{
    if(!pcache[id]){
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const res= await fetch(url);
        const pman= await res.json();
        
        pcache[id]=pman;
    };
    
    dispop(pcache[id]);
};
const dispop=(pman)=>{
    const ptype=pman.types.map(t=>t.type.name).join(', ');
    const pability=pman.abilities.map(a=>a.ability.name).join(', ');
    const image=pman.sprites['front_default'];
    const htmlstring= `<div class="popup">
        <button id="closebtn" onclick="closeUp()">Close</button>
        <div class="card">
            <img class="card-image" src="${image}"/>
            <h2 class="card-title">${pman.id}. ${pman.name}</h2>
                <p><small>Weight: </small>${pman.weight}</p>
                <p><small>Height: </small>${pman.height}</p>
                <p><small>Types: </small>${ptype}</p>
                <p><small>Abilities: </small>${pability}</p>
        </div>
    </div>`;
    
    poke.innerHTML=htmlstring+poke.innerHTML;
};

const closeUp=()=>{
    const elerem=document.querySelector('.popup');
    elerem.parentElement.removeChild(elerem);
};
fetchpokedex();

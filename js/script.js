// Seletores de elementos DOM
const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');

const tablePokemonInfo = document.querySelector('.pokemon_data_info');
const pokemonInfo = document.querySelector('.info_status');
const pokemonInfoNumber = document.querySelector('.info_status_number');
const pokemonInfoTotal = document.querySelector('.info_status_total_number');

const tablePokemonHeiWei = document.querySelector('.pokemon_wei_hei');
const pokemonInfoHeiWei = document.querySelector('.info_wei_hei');
const pokemonInfoHeiWeiValor = document.querySelector('.info_wei_hei_val');

const pokemonImage = document.querySelector('.pokemon_image');
const pokemonImageShiny = document.querySelector('.pokemon_image_shiny');
const pokemonType1 = document.querySelector('.pokemon_type1');
const pokemonType2 = document.querySelector('.pokemon_type2');

const pokemonImageBackground = document.querySelector('.pokemon_image_background');

const form = document.querySelector('.form');
const input = document.querySelector('.input_search');

const nextPokemon = document.querySelector('.btn-next');
const prevPokemon = document.querySelector('.btn-prev');

const nextForm = document.querySelector('.btn-next-form');
const prevForm = document.querySelector('.btn-prev-form');

const btnMale = document.querySelector('.btn-male');
const btnFemale = document.querySelector('.btn-female');

let searchPokemon = 1;

// Função para atualizar atributos do DOM
const updateElementAttributes = (element, attributes) => {
    Object.keys(attributes).forEach(attr => {
        element[attr] = attributes[attr];
    });
};

// Função para exibir ou ocultar elementos
const setDisplay = (element, display) => {
    element.style.display = display ? 'flex' : 'none';
};

// Função para definir o fundo com base no tipo de Pokémon
const setBackgroundImage = (type1String, type2String) => {
    const backgroundMap = {
        3: './images/background_air.png',
        11: './images/background_water.png',
        light: './images/background_light.png',
        night: './images/background_night.png'
    };

    const backgroundLight = [1, 2, 4, 5, 6, 7, 9, 10, 12, 13, 18];
    const backgroundNight = [8, 14, 15, 16, 17];

    // Função auxiliar para determinar o tipo de fundo
    const getBackgroundType = (type) => {
        if (backgroundMap[type]) return backgroundMap[type];
        if (backgroundLight.includes(type)) return backgroundMap['light'];
        if (backgroundNight.includes(type)) return backgroundMap['night'];
        return null; // Padrão para tipos não definidos, se necessário
    };

    // Determinar o fundo com base nos tipos fornecidos
    const backgroundSrc = getBackgroundType(type1String) || (type2String && getBackgroundType(type2String));

    if (backgroundSrc) {
        pokemonImageBackground.style.display = 'flex';
        pokemonImageBackground.src = backgroundSrc;
    } else {
        // Opção de ocultar o fundo se nenhum tipo de Pokémon corresponder (opcional)
        pokemonImageBackground.style.display = 'none';
    }
};

// Função para buscar dados do Pokémon da API
const fetchPokemon = async (pokemon) => {
    if(isNaN(pokemon)) {
        pokemon = 1
    }

    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    return APIResponse.status === 200 ? APIResponse.json() : null;
};

// Função para renderizar o Pokémon no DOM
const renderPokemon = async (pokemon, gender = null) => {
    pokemonName.innerHTML = 'loading...';
    pokemonNumber.innerHTML = '';
    setDisplay(pokemonType2, false);
    setDisplay(pokemonType1, false);
    setDisplay(pokemonImageShiny, false);
    
    const data = await fetchPokemon(pokemon);

    if (!data) {
        // Caso Pokémon não seja encontrado
        ['Not found', '', 'none'].forEach((value, index) => {
            if (index === 0) pokemonName.innerHTML = value;
            else if (index === 1) pokemonNumber.innerHTML = value;
            else {
                [pokemonImage, pokemonImageShiny, pokemonType1, pokemonType2, pokemonImageBackground].forEach(element => setDisplay(element, false));
                [tablePokemonInfo, tablePokemonHeiWei, btnFemale, btnMale, prevForm, nextForm].forEach(element => element.hidden = true);
            }
        });
        return;
    }

    // Dados do Pokémon disponíveis
    tablePokemonInfo.hidden = false;
    tablePokemonHeiWei.hidden = false;

    
    // Processamento de tipos de Pokémon
    const getTypeIndex = (url) => parseInt(url.slice(url.length - 3).replace('/', ''));
    const type1String = getTypeIndex(data.types[0].type.url);
    const type2String = data.types[1] ? getTypeIndex(data.types[1].type.url) : null;

    if (type2String) {
        setDisplay(pokemonType2, true);
        pokemonType2.src = `./images/type-${type2String}.png`;
    }

    // Definir o fundo com base no tipo de Pokémon
    setBackgroundImage(type1String, type2String);
        
    // Renderização da imagem do Pokémon
    setDisplay(pokemonImage, true);
    updateElementAttributes(pokemonName, { innerHTML: data.species.name });
    updateElementAttributes(pokemonNumber, { innerHTML: `${data.id} - ` });

    const isMobileDevice = /android|iphone|kindle|ipad/i.test(navigator.userAgent);

    const setImageAttributes = (imageElement, imageUrl, height, positionProps) => {
        updateElementAttributes(imageElement, { src: imageUrl });
        updateElementAttributes(imageElement.style, { height, ...positionProps });
    };

    const mobileProps = {
        imageHeight: '15%',
        imagePosition: { bottom: '45.5%', left: '34%' },
        shinyHeight: '15%',
        shinyPosition: { bottom: '45.5%', left: '34%' },
    };

    const desktopProps = {
        imageHeight: '15%',
        imagePosition: { bottom: '45.5%', left: '28%' },
        shinyHeight: '15%',
        shinyPosition: { bottom: '45.5%', left: '28%' },
    };

    const standardProps = {
        mobile: {
            imageHeight: '24%',
            imagePosition: { top: '34%', left: '29.6%' },
            shinyHeight: '24%',
            shinyPosition: { top: '34%', left: '29.6%' },
        },
        desktop: {
            imageHeight: '32%',
            imagePosition: { bottom: '39%', left: '27%' },
            shinyHeight: '32%',
            shinyPosition: { bottom: '39%', left: '27%' },
        }
    };

    const props = data.id < 650 ? (isMobileDevice ? mobileProps : desktopProps) : standardProps[isMobileDevice ? 'mobile' : 'desktop'];

    if (data.id < 650) {
        setImageAttributes(pokemonImage, data.sprites.versions['generation-v']['black-white'].animated['front_default'], props.imageHeight, props.imagePosition);
        setImageAttributes(pokemonImageShiny, data.sprites.versions['generation-v']['black-white'].animated['front_shiny'], props.shinyHeight, props.shinyPosition);
    } else {
        if (data.sprites['front_female'])  {
            if (gender === 1) {
                btnMale.hidden = false;
                btnFemale.hidden = true;
                setImageAttributes(pokemonImage, data.sprites['front_female'], props.imageHeight, props.imagePosition);
                setImageAttributes(pokemonImageShiny, data.sprites['front_shiny_female'], props.shinyHeight, props.shinyPosition);
            } else {
                btnMale.hidden = true;
                btnFemale.hidden = false;
                setImageAttributes(pokemonImage, data.sprites['front_default'], props.imageHeight, props.imagePosition);
                setImageAttributes(pokemonImageShiny, data.sprites['front_shiny'], props.shinyHeight, props.shinyPosition);
            }
        } else {
            btnMale.hidden = true;
            btnFemale.hidden = true;
            setImageAttributes(pokemonImage, data.sprites['front_default'], props.imageHeight, props.imagePosition);
            setImageAttributes(pokemonImageShiny, data.sprites['front_shiny'], props.shinyHeight, props.shinyPosition);
        }
    }

    setDisplay(pokemonType1, true);
    pokemonType1.src = `./images/type-${type1String}.png`;

    // Atualização de informações no DOM
    pokemonInfo.innerHTML = 'HP:' + '<br>Atk:' + '<br>Def:' + '<br>Sp. Atk:' + '<br>Sp. Def:' + '<br>Speed:';
    pokemonInfoNumber.innerHTML = data.stats.map(stat => stat['base_stat']).join('<br>');
    pokemonInfoTotal.innerHTML = data.stats.reduce((acc, stat) => acc + parseInt(stat['base_stat']), 0);

    pokemonInfoHeiWei.innerHTML = 'Height: ' + '<br>Weight:';
    pokemonInfoHeiWeiValor.innerHTML = `${data.height}<br>${data.weight}`;

    prevForm.hidden = true;
    nextForm.hidden = false;
    input.value = '';
    searchPokemon = data.id;
}

// Event Listeners
form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

prevPokemon.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

nextPokemon.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

prevForm.addEventListener('click', () => {
    prevForm.hidden = true;
    nextForm.hidden = false;
    setDisplay(pokemonImage, true);
    setDisplay(pokemonImageShiny, false);
});

nextForm.addEventListener('click', () => {
    prevForm.hidden = false;
    nextForm.hidden = true;
    setDisplay(pokemonImage, false);
    setDisplay(pokemonImageShiny, true);
});

btnMale.addEventListener('click', () => {
    btnMale.hidden = true;
    btnFemale.hidden = false;
    renderPokemon(searchPokemon, 0);
});

btnFemale.addEventListener('click', () => {
    btnFemale.hidden = true;
    btnMale.hidden = false;
    renderPokemon(searchPokemon, 1);
});

// Renderiza o Pokémon inicial
renderPokemon(searchPokemon);

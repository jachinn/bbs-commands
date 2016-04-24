var chars = document.querySelectorAll(".who .char");
var commandInput = document.querySelector('.commandInput input');
var commandSuggestions = document.querySelector('#meldSuggestions');
var commands = document.querySelectorAll(".command");
var typeOptions = document.querySelector(".typeSelect select");
var abilityOptions = document.querySelector(".abilitySelect select");
var reset = document.querySelector(".reset");
var filters = [];
//holds all filter options but only actually needs to hold ingredients/melds
//could be used to do autocomplete for all fields
var filterOptions = [];

var abilities = "Treasure Magnet, HP Prize Plus, Link Prize Plus, Lucky Strike, HP Boost, Fire Boost, Blizzard Boost, Thunder Boost, Cure Boost, Item Boost, Attack Haste, Magic Haste, Combo F Boost, Finish Boost, Fire Screen, Blizzard Screen, Thunder Screen, Dark Screen, Reload Boost, Defender, Zero EXP, Combo Plus, Air Combo Plus, EXP Chance, EXP Walker, Damage Syphon, Second Chance, Once More, Scan, Leaf Bracer".split(', ');
abilityReset = document.createElement("option");
abilityReset.textContent = "Select";
abilityOptions.appendChild(abilityReset);

function Filter(type, name) {
    this.type = type;
    this.name = name;
}

filterOptions.push(new Filter("person", "T"));
filterOptions.push(new Filter("person", "V"));
filterOptions.push(new Filter("person", "A"));


for (var i = 65; i < 81; i++) { //A through P
	var type = String.fromCharCode(i);
	var option = document.createElement("option");
	option.textContent = type;
    filterOptions.push(new Filter("type", "type" + type));
	typeOptions.appendChild(option);
}

var resetOption = document.createElement("option");
resetOption.textContent = "Select";
var firstOption = typeOptions.firstChild;
typeOptions.insertBefore(resetOption, firstOption);

var melds = [];
Array.prototype.forEach.call(commands, function(command) {
    var meld = command.cells[0].textContent;
    var meldFilter = new Filter("meld", meld);
    if (!isInArray(melds, meld)) {
        melds.push(meld);
        filterOptions.push(meldFilter);
    }
});

var ingColumnsData = document.querySelectorAll(".command td .ingredient");
var ingredients = [];
Array.prototype.forEach.call(ingColumnsData, function(ing) {
    var ingFilter = new Filter("ingredient", ing.textContent);
    if (!isInArray(ingredients, ing.textContent)) {
        ingredients.push(ing.textContent);
        filterOptions.push(ingFilter);
    }
});
var ingredientInput = document.querySelector('.ingredientInput input');
var ingredientSuggestions = document.querySelector('#ingredientSuggestions');

abilities.forEach(function(ability) {
    var abilityEl = document.createElement("option");
    abilityEl.textContent = ability;
    filterOptions.push(new Filter("ability", ability));
    abilityOptions.appendChild(abilityEl);
    
});

function getClasses(command) {
    return command.className.split(' ');
}

function getAbilities(command) {
    var commandAbilities = [];
    try{ //avoid adding commands that don't have abilities
        for (var i = 4; i <= 10; i++) {
            commandAbilities.push(command.children[i].textContent);
        }
    } finally {
            return commandAbilities;
    }
}

function isInArray(array, item) {
    return array.indexOf(item) > -1;
}

function matches(filter, command) {
    if (filter.type == "person" || filter.type == "type"){
        var classes = getClasses(command);
        return isInArray(classes, filter.name);
    } else if (filter.type == "meld") {
        return command.cells[0].textContent == filter.name;
    } else if (filter.type == "ingredient") {
        var ing1 = command.children[2].children[0].textContent;
        var ing2 = command.children[2].children[2].textContent;
        return ing1 == filter.name || ing2 == filter.name;
    } else if (filter.type == "ability") {
        var commAbilities = getAbilities(command);
        return isInArray(commAbilities, filter.name);
    }
}

function applyFilters(filters) {
    if (filters.length == 0) {
        Array.prototype.forEach.call(commands, function(command) {
            show(command);
        });
        return;
    }
    Array.prototype.forEach.call(commands, function(command) {
        var showMe = true;
        filters.forEach(function(filter) {
            if (showMe && matches(filter, command)) {
                show(command);
            } else { 
                hide(command); 
                showMe = false;
            }
        });
    });
}



function show(command) {
    command.style.display = '';
}

function hide(command){
   command.style.display = 'none';
}

function removeFromArray(array, item) {
    if (array.indexOf(item) > -1) {
        array.splice(array.indexOf(item),1);
        return array;
    }
}

function deFilter(type) {
    filters.forEach(function(item) {
        if (item.type == type) {
            removeFromArray(filters, item);
        }
    });
    return filters;
}
//case-folds
function contains(big, little) {
    big = big.toLowerCase();
    little = little.toLowerCase();
    return big.indexOf(little) > -1;
}
//event listeners
reset.addEventListener("click", function() {
    filters = [];
    typeOptions.value = "Select";
    chars[0].checked = true;
    commandInput.value = '';
    ingredientInput.value = '';
    abilityOptions.value = "Select";
    applyFilters(filters);
});
chars[0].addEventListener("click", function(){
    filters = deFilter("person");
    applyFilters(filters);
});
for (var i = 1; i < chars.length; i++) {
    chars[i].addEventListener("click", function(event) {
        var person = event.target.value;
        filters = deFilter("person");
        filters.push(new Filter("person", person));
        applyFilters(filters);
    });
} 
typeOptions.addEventListener("change", function(event) {
    filters = deFilter("type");
    if (event.target.value == "Select") { 
        applyFilters(filters);
    } else {
        filters.push(new Filter("type", "type" + event.target.value));
        applyFilters(filters);
    }
});
abilityOptions.addEventListener("change", function(event) {
    filters = deFilter("ability");
    if (event.target.value == "Select") {
        applyFilters(filters);
    } else {
        filters.push(new Filter("ability", event.target.value));
        applyFilters(filters);
    }
});
commandInput.addEventListener("input", function(event) {
    onType(meldSuggestions, "meld", event.target.value);
        
});
commandInput.addEventListener("blur", function(event) {
    meldSuggestions.style.display = 'none';
})
ingredientInput.addEventListener("input", function(event) {
    onType(ingredientSuggestions, "ingredient", event.target.value);
});
ingredientInput.addEventListener("input", function(event) {
    ingredientSuggestions.style.display = 'none';
})

//autocomplete handler
function onType(suggestions, type, input){
    suggestions.textContent = '';
    filters = deFilter(type);
    suggestions.style.display = 'block';
    if (input == '') {
        applyFilters(filters);
        suggestions.style.display = 'none';
    } else {
        
        filterOptions.forEach(function(item) {
            if (item.type == type){
                if (contains(item.name, input)) {
                    var p = document.createElement("p");
                    p.textContent = item.name;
                    suggestions.appendChild(p);
                    p.addEventListener("click", function(event) {
                        filters = deFilter(type);
                        filters.push(new Filter(type, event.target.textContent));
                        applyFilters(filters);
                        suggestions.style.display = 'none';
                        suggestions.parentNode.children[0].value = event.target.textContent;
                    });
                }
            }
        });
    }
}

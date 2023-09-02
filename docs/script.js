class AbilityScores
{
    static AbilityScoresCount = 6;
    
    static Strength = 0;
    static Dexterity = 1;
    static Constitution = 2;
    static Intelligence = 3;
    static Wisdom = 4;
    static Charisma = 5;

    constructor(str, dex, con, int, wis, cha)
    {
        this.strength = str;
        this.dexterity = dex;
        this.constitution = con;
        this.intelligence = int;
        this.wisdom = wis;
        this.charisma = cha;
    }

    abilityScore(i)
    {
        switch(i)
        {
            case 0: return this.strength;
            case 1: return this.dexterity;
            case 2: return this.constitution;
            case 3: return this.intelligence;
            case 4: return this.wisdom;
            case 5: return this.charisma;
        }
    }

    static abilityScoreName(i)
    {
        switch(i)
        {
            case 0: return 'Strength';
            case 1: return 'Dexterity';
            case 2: return 'Constitution';
            case 3: return 'Intelligence';
            case 4: return 'Wisdom';
            case 5: return 'Charisma';
        }
        return '';
    }

    static modifier(abilityScore)
    {
        switch (abilityScore)
        {
            case 3:
                return -3;
            case 4:
            case 5:
                return -2;
            case 6:
            case 7:
            case 8:
                return -1;
            case 9:
            case 10:
            case 11:
            case 12:
                return 0;
            case 13:
            case 14:
            case 15:
                return +1;
            case 16:
            case 17:
                return +2;
            case 18:
                return +3;
        }
        if(abilityScore >= 19) return +3;
        return 999;
    }

    static copy(toCopy)
    {
        return new AbilityScores(toCopy.strength, toCopy.dexterity, toCopy.constitution, toCopy.intelligence, toCopy.wisdom, toCopy.charisma);
    }
}

class CharacterClass
{
    static CharacterClassCount = 9;
    static CharacterKindredClassCount = 14;

    static Cleric = 0;
    static Enchanter = 1;
    static Fighter = 2;
    static Friar = 3;
    static Hunter = 4;
    static Knight = 5;
    static Magician = 6;
    static Minstrel = 7;
    static Thief = 8;
    static Breggle = 9;
    static Mossling = 10;
    static Elf = 11;
    static Grimalkin = 12;
    static Woodgrue = 13;

    static characterClassName(i)
    {
        switch(i)
        {
            case 0: return 'Cleric';
            case 1: return 'Enchanter';
            case 2: return 'Fighter';
            case 3: return 'Friar';
            case 4: return 'Hunter';
            case 5: return 'Knight';
            case 6: return 'Magician';
            case 7: return 'Minstrel';
            case 8: return 'Thief';
            case 9: return 'Breggle';
            case 10: return 'Mossling';
            case 11: return 'Elf';
            case 12: return 'Grimalkin';
            case 13: return 'Woodgrue';
        }
        return '';
    }
}

let kindredMode = false;
let currentCharClass = -1;
let currentScores = null;
let originalScores = null;
let abilityToIncrease = -1;

//Disable all +,- buttons
for (let ability = 0; ability < AbilityScores.AbilityScoresCount; ability++) 
{
    document.getElementById(AbilityScores.abilityScoreName(ability).toLowerCase() + "+").disabled = true; 
    document.getElementById(AbilityScores.abilityScoreName(ability).toLowerCase() + "-").disabled = true; 
}

//Disable reset button
document.getElementById("reset").disabled = true; 

//Reset the alignment form
document.getElementById("alignmentForm").reset();

const alignmentOff = "";
const alignmentOn = "<input type=\"radio\" id=\"lawful\" name=\"radio_alignment\" value=\"Lawful\"><label for=\"lawful\">Lawful</label><br><input type=\"radio\" id=\"neutral\" name=\"radio_alignment\" value=\"Neutral\"><label for=\"neutral\">Neutral</label><br><input type=\"radio\" id=\"chaotic\" name=\"radio_alignment\" value=\"Chaotic\"><label for=\"chaotic\">Chaotic</label><br>"
const alignmentNoChaos =  "<input type=\"radio\" id=\"lawful\" name=\"radio_alignment\" value=\"Lawful\"><label for=\"lawful\">Lawful</label><br><input type=\"radio\" id=\"neutral\" name=\"radio_alignment\" value=\"Neutral\"><label for=\"neutral\">Neutral</label><br>"

document.getElementById("alignmentForm").innerHTML = alignmentOff;
document.getElementById("alignmentWarning").innerHTML = "<p></p>";

function rollAbilityScores()
{
    resetAdjustAbilityScores();
    //Disable all + buttons
    for (let ability = 0; ability < AbilityScores.AbilityScoresCount; ability++) 
    { 
        document.getElementById(AbilityScores.abilityScoreName(ability).toLowerCase() + "+").disabled = true; 
    }
    document.getElementById("alignmentForm").innerHTML = alignmentOff;
    document.getElementById("alignmentWarning").innerHTML = "<p></p>";

    var scores = new AbilityScores(roll3d6(), roll3d6(), roll3d6(), roll3d6(), roll3d6(), roll3d6());
    currentScores = scores;
    originalScores = null;

    document.getElementById("reset").disabled = true; 

    populateAbilityScores(scores);

    let underSeven = numberOfAbilityScoresUnderSeven(scores);

    if(underSeven > 1 || allUnderNine(scores))
        document.getElementById("subparCharacters").innerHTML = "!Subpar Characters (Optional Rule) <button type=\"button\" onclick=\"rollAbilityScores()\">Reroll</button>";
    else
        document.getElementById("subparCharacters").innerHTML = "Subpar Characters (Optional Rule) <button disabled type=\"button\" onclick=\"rollAbilityScores()\">Reroll</button>";

    populateClasses(scores);
}

defaultBorderStyle = "";
defaultBorderColor = "";
defualtBorderWidth = "";
function selectClass(charClass)
{
    if(charClass != currentCharClass)
    {
        resetAdjustAbilityScores();

        const id = CharacterClass.characterClassName(charClass).toLocaleLowerCase() + "Button";
        defaultBorderStyle = document.getElementById(id).style.borderStyle;
        defaultBorderColor = document.getElementById(id).style.borderColor;
        defualtBorderWidth = document.getElementById(id).style.borderWidth;
    }

    if(currentCharClass != -1)
    {
        const id = CharacterClass.characterClassName(currentCharClass).toLocaleLowerCase() + "Button";
        document.getElementById(id).style.borderStyle = defaultBorderStyle;
        document.getElementById(id).style.borderColor = defaultBorderColor;
        document.getElementById(id).style.borderWidth = defualtBorderWidth;
    }

    currentCharClass = charClass;
    const id = CharacterClass.characterClassName(charClass).toLocaleLowerCase() + "Button";
    document.getElementById(id).style.borderStyle = "solid";
    document.getElementById(id).style.borderColor = "#d54135";
    document.getElementById(id).style.borderWidth = "2px";

    if(charClass == CharacterClass.Cleric)
    {
        document.getElementById("alignmentWarning").innerHTML = "<p>As servants of the Church, clerics must be Lawful or Neutral.</p>";
        document.getElementById("alignmentForm").innerHTML = alignmentNoChaos;
    }
    else if(charClass == CharacterClass.Friar)
    {
        document.getElementById("alignmentWarning").innerHTML = "<p>As servants of the Church, friars must be Lawful or Neutral.</p>"
        document.getElementById("alignmentForm").innerHTML = alignmentNoChaos;
    }
    else
    {
        document.getElementById("alignmentWarning").innerHTML = "";
        document.getElementById("alignmentForm").innerHTML = alignmentOn;
    }

    activatePrimePluses(charClass);

    populateKindred();
}

function activatePrimePluses(charClass)
{
    //Disable all + buttons
    for (let ability = 0; ability < AbilityScores.AbilityScoresCount; ability++) 
    { 
        document.getElementById(AbilityScores.abilityScoreName(ability).toLowerCase() + "+").disabled = true; 
    }
    let primeAbilitiesArray = primeAbilities(charClass);
    let eligibleAbilities = [];
    for (let ability = 0; ability < AbilityScores.AbilityScoresCount; ability++) 
    {
        if(!primeAbilitiesArray.includes(ability) && currentScores.abilityScore(ability) > 10) eligibleAbilities.push(ability);
    }
    if(eligibleAbilities.length != 0)
    {
        for (let i = 0; i < primeAbilitiesArray.length; i++) 
        {
            document.getElementById(AbilityScores.abilityScoreName(primeAbilitiesArray[i]).toLowerCase() + "+").disabled = false; 
        }
    }
}

function adjustAbilityScorePlus(abilityPlus)
{
    document.getElementById("reset").disabled = true; 

    abilityToIncrease = abilityPlus;

    //Disable all +s
    for (let ability = 0; ability < AbilityScores.AbilityScoresCount; ability++) 
    {
        document.getElementById(AbilityScores.abilityScoreName(ability).toLowerCase() + "+").disabled = true; 
    }

    let primeAbilitiesArray = primeAbilities(currentCharClass);
    let eligibleAbilities = [];
    for (let ability = 0; ability < AbilityScores.AbilityScoresCount; ability++) 
    {
        if(!primeAbilitiesArray.includes(ability) && currentScores.abilityScore(ability) > 10) eligibleAbilities.push(ability);
    }

    //Enable all -s
    for (let i = 0; i < eligibleAbilities.length; i++) 
    {
        let eligibleAbility = eligibleAbilities[i];
        document.getElementById(AbilityScores.abilityScoreName(eligibleAbility).toLowerCase() + "-").disabled = false; 
    }
}

function adjustAbilityScoreMinus(abilityMinus)
{
    if(originalScores==null)
        originalScores = AbilityScores.copy(currentScores);
    
    switch(abilityMinus)
    {
        case AbilityScores.Strength: 
            currentScores.strength -= 2;
            break;
        case AbilityScores.Dexterity: 
            currentScores.dexterity -= 2;
            break;
        case AbilityScores.Constitution: 
            currentScores.constitution -= 2;
            break;
        case AbilityScores.Intelligence: 
            currentScores.intelligence -= 2;
            break;
        case AbilityScores.Wisdom: 
            currentScores.wisdom -= 2;
            break;
        case AbilityScores.Charisma: 
            currentScores.charisma -= 2;
            break;
    }
    
    switch(abilityToIncrease)
    {
        case AbilityScores.Strength: 
            currentScores.strength+=1;
            break;
        case AbilityScores.Dexterity: 
            currentScores.dexterity+=1;
            break;
        case AbilityScores.Constitution: 
            currentScores.constitution+=1;
            break;
        case AbilityScores.Intelligence: 
            currentScores.intelligence+=1;
            break;
        case AbilityScores.Wisdom: 
            currentScores.wisdom+=1;
            break;
        case AbilityScores.Charisma: 
            currentScores.charisma+=1;
            break;
    }

    abilityToIncrease = -1;

    populateAbilityScores(currentScores);
    let keepClass = currentCharClass;
    populateClasses(currentScores);
    currentCharClass = keepClass;
    selectClass(currentCharClass)
    document.getElementById("reset").disabled = false; 

    activatePrimePluses(currentCharClass);

    //Disable all - buttons
    for (let ability = 0; ability < AbilityScores.AbilityScoresCount; ability++) 
    { 
        document.getElementById(AbilityScores.abilityScoreName(ability).toLowerCase() + "-").disabled = true; 
    }
}

function allUnderNine(scores)
{
    for (let i = 0; i < AbilityScores.AbilityScoresCount; i++) 
    {
        if(scores.abilityScore(i) > 8) return false;
    }
    return true;
}

function numberOfAbilityScoresUnderSeven(scores)
{
    let underSeven = 0;
    for (let i = 0; i < AbilityScores.AbilityScoresCount; i++) 
    {
        if(scores.abilityScore(i) <= 6) underSeven++;
    }
    return underSeven;
}

function resetAdjustAbilityScores()
{
    if(originalScores != null)
    {
        currentScores = AbilityScores.copy(originalScores);
        originalScores = null;
        populateAbilityScores(currentScores);
        let keepClass = currentCharClass;
        populateClasses(currentScores);
        currentCharClass = keepClass;
        if(currentCharClass != -1)
            selectClass(currentCharClass);
    }

    document.getElementById("reset").disabled = true; 

    if(currentCharClass != -1)
        activatePrimePluses(currentCharClass);

    //Disable all - buttons
    for (let ability = 0; ability < AbilityScores.AbilityScoresCount; ability++) 
    { 
        document.getElementById(AbilityScores.abilityScoreName(ability).toLowerCase() + "-").disabled = true; 
    }
}

function populateAbilityScores(scores)
{
    for (let i = 0; i < AbilityScores.AbilityScoresCount; i++) 
    {
        populateAbilityScore(scores, i);
    }
}

function populateAbilityScore(scores, score)
{
    const scoreLower = AbilityScores.abilityScoreName(score).toLowerCase();
    document.getElementById(scoreLower+"AbilityScore").innerHTML = scores.abilityScore(score);
    let plus = '';
    if(AbilityScores.modifier(scores.abilityScore(score)) > 0) plus = '+'
    document.getElementById(scoreLower+"Mod").innerHTML = plus + AbilityScores.modifier(scores.abilityScore(score))
}

function populateClasses(scores) 
{
    currentCharClass = -1;

    const plus10 = [];
    const plus5 = [];
    const noBonus = [];
    const minus10 = [];

    for (let charClass = 0; charClass < CharacterClass.CharacterKindredClassCount; charClass++) 
    {
        if(charClass > CharacterClass.CharacterClassCount-1 && !kindredMode) continue;

        let classPrimeAbilities = primeAbilities(charClass);
        let tenPercentClass = true;
        let fivePercentClass = true;
        let noBonusClass = true;
        for (let i = 0; i < classPrimeAbilities.length; i++) 
        {
            primeAbility = classPrimeAbilities[i];
            if(scores.abilityScore(primeAbility) < 16) tenPercentClass = false
            if(scores.abilityScore(primeAbility) < 13) fivePercentClass = false
            if(scores.abilityScore(primeAbility) < 9) noBonusClass = false
        }
        if(tenPercentClass) plus10.push(charClass);
        else if (fivePercentClass) plus5.push(charClass);
        else if (noBonusClass) noBonus.push(charClass);
        else minus10.push(charClass);
    }

    populateXPList("+10xpList", plus10);
    populateXPList("+5xpList", plus5);
    populateXPList("0xpList", noBonus);
    populateXPList("-10xpList", minus10);
}

function populateXPList(id, list)
{
    let listString = "";
    
    for (let i = 0; i < list.length; i++)
    {
        let charClass = list[i];
        listString += ("<li><button class = \"classButton\""
        + "id = \"" + CharacterClass.characterClassName(charClass).toLowerCase() + "Button\" "
        + "type=\"button\" onclick="
        + "\"selectClass(" + charClass + ")\">"
        + CharacterClass.characterClassName(charClass)
        + "</button>"
        + "</li>");
    }
    document.getElementById(id).innerHTML = listString;
}

function populateKindred() 
{
    document.getElementById("favourList").innerHTML = "<li>Grimalkin - Faery</li><li>Grimalkin - Faery</li>";
    document.getElementById("commonlyList").innerHTML = "<li>Woodgrue - Demi-fey</li><li>Woodgrue - Demi-fey</li>";
    document.getElementById("yesList").innerHTML = "<li>Human</li><li>Human</li>";
    document.getElementById("occasionallyList").innerHTML = "<li>Breggle - Non-human mortal</li><li>Breggle - Non-human mortal</li>";
    document.getElementById("rarelyList").innerHTML = "<li>Elf - Faery</li><li>Elf - Faery</li>";
    document.getElementById("neverList").innerHTML = "<li>Mossling - Non-human mortal</li><li>Mossling - Non-human mortal</li>";
}

function roll3d6()
{
    return roll1d6()+roll1d6()+roll1d6();
}

function roll1d6()
{
    return rollD(6);
}

function rollD(n)
{
    return getRndInteger(1,n);
}

function getRndInteger(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function primeAbilities(lookupClass)
{
    switch (lookupClass)
    {
        case CharacterClass.Cleric:
            return [ AbilityScores.Wisdom ];
        case CharacterClass.Enchanter:
            return [ AbilityScores.Charisma, AbilityScores.Intelligence ];
        case CharacterClass.Fighter:
            return [ AbilityScores.Strength ];
        case CharacterClass.Friar:
            return  [ AbilityScores.Intelligence, AbilityScores.Wisdom ];
        case CharacterClass.Hunter:
            return  [ AbilityScores.Constitution, AbilityScores.Dexterity ];
        case CharacterClass.Knight:
            return  [ AbilityScores.Charisma, AbilityScores.Strength ];
        case CharacterClass.Magician:
            return  [ AbilityScores.Intelligence ];
        case CharacterClass.Minstrel:
            return  [ AbilityScores.Charisma, AbilityScores.Dexterity ];
        case CharacterClass.Thief:
            return  [ AbilityScores.Dexterity ];
        case CharacterClass.Breggle:
            return  [ AbilityScores.Intelligence, AbilityScores.Strength ];
        case CharacterClass.Mossling:
            return  [ AbilityScores.Constitution, AbilityScores.Wisdom ];
        case CharacterClass.Elf:
            return  [ AbilityScores.Charisma, AbilityScores.Strength ];
        case CharacterClass.Grimalkin:
            return  [ AbilityScores.Dexterity ];
        case CharacterClass.Woodgrue:
            return  [ AbilityScores.Charisma, AbilityScores.Dexterity ];
    }
    return [-1]
}
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
        return 999;
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

function rollAbilityScores()
{
    var scores = new AbilityScores(roll3d6(), roll3d6(), roll3d6(), roll3d6(), roll3d6(), roll3d6());

    populateAbilityScores(scores);
    populateClasses();

    if(true /*If character is 'subpar'*/)
        document.getElementById("subparCharacters").innerHTML = "Subpar Characters (Optional Rule) <button type=\"button\" onclick=\"rollAbilityScores()\">Reroll</button>";
    else
        document.getElementById("subparCharacters").innerHTML = "Subpar Characters (Optional Rule) <button disabled type=\"button\" onclick=\"rollAbilityScores()\">Reroll</button>";

    if(true /*are cleric*/)
        document.getElementById("alignmentWarning").innerHTML = "<p>As servants of the Church, clerics must be Lawful or Neutral.</p>";
    else if(false /*are friar*/)
        document.getElementById("alignmentWarning").innerHTML = "<p>As servants of the Church, friars must be Lawful or Neutral.</p>"
    else
        document.getElementById("alignmentWarning").innerHTML = "";
}

function todoAdjustAbilityScores(){}

function todoResetAdjustAbilityScores(){}

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

function populateClasses() 
{
    document.getElementById("+10xpList").innerHTML = "<li>Fighter</li><li>Cleric</li>";
    document.getElementById("+5xpList").innerHTML = "<li>Fighter</li><li><button type=\"button\" onclick=\"populateKindred()\">Cleric</button> </li>";
    document.getElementById("0xpList").innerHTML = "<li>Fighter</li><li>Cleric</li>";
    document.getElementById("-10xpList").innerHTML = "<li>Fighter</li><li>Cleric</li>";
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

function PrimeAbilities(lookupClass)
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
    return -1
}
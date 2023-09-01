alignmentWarning();

function rollAbilityScores()
{
    populateClasses();
    if(true /*If character is 'subpar'*/)
        document.getElementById("subparCharacters").innerHTML = "Subpar Characters (Optional Rule) <button type=\"button\" onclick=\"rollAbilityScores()\">Reroll</button>";
    else
        document.getElementById("subparCharacters").innerHTML = "Subpar Characters (Optional Rule) <button disabled type=\"button\" onclick=\"rollAbilityScores()\">Reroll</button>";
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

function alignmentWarning()
{
    if(true /*are cleric*/)
    document.getElementById("alignmentWarning").innerHTML = "<p>As servants of the Church, clerics must be Lawful or Neutral.</p>";
    else if(false /*are friar*/)
    document.getElementById("alignmentWarning").innerHTML = "<p>As servants of the Church, friars must be Lawful or Neutral.</p>"
    else
    document.getElementById("alignmentWarning").innerHTML = "";
}
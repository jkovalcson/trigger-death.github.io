/*=====================================================================================
AUTO-COOKIE MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-death/CookieMods
// Raw File:     https://raw.githubusercontent.com/trigger-death/CookieMods/master/AutoCookie.js

// Based off "Cookieclicker Bots".
// Link: https://gist.githubusercontent.com/pernatiy/38bc231506b06fd85473/raw/cc.js

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'AutoCookie';
	var url = document.getElementById('modscript_' + name).getAttribute('src');
	url = url.replace('Scripts/' + name + '.js', '');
	return url;
}
/* Returns true if the specified mod is loaded. */
function IsModLoaded(name) {
	return document.getElementById('modscript_' + name) != null;
}
/* Loads the mod from the same location as this mod if the mod hasn't been loaded yet. */
function LoadMod(name) {
	if (!IsModLoaded(name)) {
		var url = GetModURL() + 'Scripts/' + name + '.js';
		Game.LoadMod(url);
	}
}
/* Loads the style sheet from the same location as this mod. */
function LoadStyleSheet(name) {
	var url = GetModURL() + 'Styles/' + name + '.css';

	var link = document.createElement("link");
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = url;
	link.media = 'all';

	document.head.appendChild(link);
	console.log('Loaded the style sheet ' + url + ', ' + name + '.');
}
/* Returns true if the variable is defined and equals the value. */
function IsDefined(name, value) {
	return eval('(typeof ' + name.split('.')[0] + ' !== \'undefined\') && (typeof ' + name + ' !== \'undefined\') && (' + name + ' === ' + value + ')');
}
/* Creates an interval to wait until the specified mod is loaded */
function IntervalUntilLoaded(mod, func) {
	var checkReady = setInterval(function () {
		if (IsDefined(mod + '.Loaded', 'true')) {
			func();
			clearInterval(checkReady);
		}
	}, 100);
}
/* Returns the element used in Auto Cookie. */
function lAuto(name) {
	if (name.indexOf('AutoCookie') != 0)
		return l('AutoCookie' + name);
	return l(name);
}
/* Returns the element with the name used in Auto Cookie. */
function iAuto(name) {
	if (name.indexOf('AutoCookie') != 0)
		return 'AutoCookie' + name;
	return name;
}

//#endregion
/*=====================================================================================
AUTO-COOKIE DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the mod. */
AutoCookie = {};
/* The static class that manages Game backups. */
AutoCookie.Backup = {};
/* True if the mod has been loaded. */
AutoCookie.Loaded = false;
/* True if the mod is enabled. */
AutoCookie.Enabled = false;

//#endregion
/*=====================================================================================
AUTO-COOKIE INITIALIZATION
=======================================================================================*/

/* Initializes Auto-Cookie. */
AutoCookie.Init = function () {

	LoadMod('TriggerCookies');

	IntervalUntilLoaded('TriggerCookies', function () {
		TriggerCookies.AddMod('Auto Cookie', [22, 7], AutoCookie.Enable, AutoCookie.Disable, AutoCookie.WriteMenu, AutoCookie.UpdateMenu, true);

		// Hey guess what!? This is a mod you're using! So why not receive the plugin shadow achievement?
		Game.Win('Third-party');

		AutoCookie.Loaded = true;
	});
}

/* Enables Auto-Cookie. */
AutoCookie.Enable = function () {

	AutoCookie.Actions['autobuy'].Enable(false);
	AutoCookie.Actions['checkautoclick'].Enable(false);
	AutoCookie.Actions['checkascendinputs'].Enable(false);

	AutoCookie.Enabled = true;
}
/* Disables Auto-Cookie. */
AutoCookie.Disable = function () {

	AutoCookie.DisableAll();
	AutoCookie.Actions['autobuy'].Disable(false);
	AutoCookie.Actions['checkautoclick'].Disable(false);
	AutoCookie.Actions['checkascendinputs'].Disable(false);

	AutoCookie.Enabled = false;
}

/*=====================================================================================
AUTO-COOKIE MENU
=======================================================================================*/

AutoCookie.WriteSectionHead = function (name, icon) {
	var str = '';
	str += '<div class="listing"><div class="icon" style="background-position:' + (-icon[0] * 48) + 'px ' + (-icon[1] * 48) + 'px;"></div>' +
				'<span style="vertical-align:100%;"><span class="title" style="font-size:22px;">' + name + '</span></span></div>';

	str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 4px 0px 10px 14px;"></div>';

	return str;
}

AutoCookie.WriteSectionMiddle = function () {

	//var str = '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 6px 0px 6px 14px;"></div>';
	var str = '<div style="width: 100%; margin: 12px 0px;"></div>';
	return str;
}
AutoCookie.WriteSectionEnd = function () {

	var str = '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 10px 0px 6px 14px;"></div>';
	return str;
}

AutoCookie.WriteSpacing = function (pixels) {
	if (!pixels)
		pixels = 8;
	var str = '<div style="margin-left: ' + pixels.toString() + 'px; display: inline;"></div>';
	return str;
}

/* Writes the Auto-Cookie buttons. */
AutoCookie.WriteMenu = function (tab) {

	var str = '';

	if (tab == 'Automation') {

		str += AutoCookie.WriteSectionHead('Auto Clicking', [12, 0]);

		str += '<div class="listing">' +
				AutoCookie.WriteButton('allclick') +
				AutoCookie.WriteButton('noneclick') +
				'</div>';

		str += '<div class="listing">' +
				AutoCookie.WriteButton('gold') +
				AutoCookie.WriteButton('wrath') +
				//AutoCookie.WriteButton('gnotify') +
				AutoCookie.WriteSpacing() +
				AutoCookie.WriteButton('wrinkler') +
				AutoCookie.WriteButton('reindeer') +
				'</div>';

		str += '<div class="listing">' +
				'Clicks per second (max 250): ' +
				'<input id="' + iAuto('clickRateInput') + '" type="text" value="' + AutoCookie.AutoClickRate + '" style="width: 80px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				AutoCookie.WriteSpacing() +
				AutoCookie.WriteButton('autoclick') +
				'</div>';



		str += AutoCookie.WriteSectionEnd();
		str += AutoCookie.WriteSectionHead('Autobuy', [15, 0]);

		str += '<div class="listing">' +
				AutoCookie.WriteButton('allbuy') +
				AutoCookie.WriteButton('nonebuy') +
				'</div>';

		str += '<div class="listing">' +
				AutoCookie.WriteButton('autobuildings') +
				AutoCookie.WriteButton('autoupgrades') +
				AutoCookie.WriteButton('autoresearch') +
				AutoCookie.WriteButton('autoseason') +
				//'<label id="' + iAuto('nextItem') + '"> Next ' + AutoCookie.NextItem.Type + ': ' + AutoCookie.NextItem.Name + '</label>' +
				'</div>';

		str += '<div class="listing"><b id="' + iAuto('nextType') + '">Next item : </b> <div id="' + iAuto('nextItem') + '" class="priceoff">' + Beautify(Game.heavenlyCookies) + '</div></div>';

		str += AutoCookie.WriteSectionEnd();

		str += AutoCookie.WriteSectionHead('Ascending', [19, 7]);

		str += '<div class="listing">' +
				AutoCookie.WriteButton('autoascend') +
				AutoCookie.WriteButton('allowdevil') +
				'</div>';

		str += '<div class="listing">' +
				'Min Ascend Chips: ' +
				'<input id="' + iAuto('ascendMinChips') + '" type="text" value="' + Beautify(AutoCookie.AscendMinChips) + '" style="width: 160px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				AutoCookie.WriteSpacing() +
				'Min Ascend Multiplier: ' +
				'<input id="' + iAuto('ascendMinMultiplier') + '" type="text" value="' + Beautify(AutoCookie.AscendMinMultiplier) + '" style="width: 80px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				'</div>';
		str += '<div class="listing">' +
				'Max Ascend Chips: ' +
				'<input id="' + iAuto('ascendMaxChips') + '" type="text" value="' + Beautify(AutoCookie.AscendMaxChips) + '" style="width: 160px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				AutoCookie.WriteSpacing() +
				'Max Ascend Multiplier: ' +
				'<input id="' + iAuto('ascendMaxMultiplier') + '" type="text" value="' + Beautify(AutoCookie.AscendMaxMultiplier) + '" style="width: 80px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				'</div>';
		str += '<div class="listing">' +
				'Percentage of chips used for cookies: ' +
				'<input id="' + iAuto('chipsForCookies') + '" type="text" value="' + AutoCookie.ChipsForCookies + '%" style="width: 60px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				'</div>';


		var ascendNowToGet = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset));
		var heavenlyChips = Game.heavenlyChipsEarned;

		// log ten so the scale progression is actually useful
		var logMinChips = Math.log(AutoCookie.AscendMinChips) / Math.log(10);
		var logMaxChips = Math.log(AutoCookie.AscendMaxChips) / Math.log(10);
		var logChips = Math.log(Game.heavenlyChipsEarned) / Math.log(10);

		var scale = 0.0;
		if (heavenlyChips >= AutoCookie.AscendMinChips) {
			if (heavenlyChips >= AutoCookie.AscendMaxChips) {
				scale = 1.0;
			}
			else {
				scale = (logChips - logMinChips) / (logMaxChips - logMinChips);
				scale = Math.sqrt(1 - Math.pow(1 - scale, 2));
			}
		}

		var multiplier = AutoCookie.AscendMaxMultiplier + (1.0 - scale) * (AutoCookie.AscendMinMultiplier - AutoCookie.AscendMaxMultiplier);
		var nextAscend = Game.heavenlyChipsEarned * (multiplier - 1);

		if (heavenlyChips < AutoCookie.AscendMinChips) {
			multiplier = 0;
			scale = 0.0;
			nextAscend = AutoCookie.AscendMinChips;
		}

		str += '<div class="listing"><b>Next Ascend at :</b>' +
			AutoCookie.WriteSpacing(8) +
			'<div id="' + iAuto('nextAscend') + '" class="price plain heavenly">' + Beautify(nextAscend) +
			' <small>(scale : ' + Beautify(scale, 2) + '  multiplier : ' + Beautify(multiplier) + ')</small>' +
			(ascendNowToGet >= nextAscend ? ' Ready'.fontcolor('green') : '') +
			'</div>' +
			'</div></div>';

		str += AutoCookie.WriteSectionEnd();

		str += AutoCookie.WriteSectionHead('Achievements', [12, 5]);

		str += '<div class="listing"><div class="priceoff">' + 'No achievement hunting features yet...' + '</div></div>';

		str += AutoCookie.WriteSectionEnd();
	}

	return str;
}
/* Writes the Auto-Cookie buttons. */
AutoCookie.UpdateMenu = function () {

	//lAuto('nextItem').innerHTML = (AutoCookie.NextItem.Type != 'invalid' ? ('Next ' + AutoCookie.NextItem.Type + ': ' + AutoCookie.NextItem.Name) : '');

	if (lAuto('nextItem') != null) {
		lAuto('nextItem').innerHTML = (AutoCookie.NextItem.Type != 'invalid' ? AutoCookie.NextItem.Name : 'N/A');
		lAuto('nextType').innerHTML = 'Next ' + (AutoCookie.NextItem.Type != 'invalid' ? AutoCookie.NextItem.Type : 'item') + ' : ';
	}

	AutoCookie.UpdateAscendInfo();
}

AutoCookie.UpdateAscendInfo = function () {

	var ascendNowToGet = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset));
	var heavenlyChips = Game.heavenlyChipsEarned;

	// log ten so the scale progression is actually useful
	var logMinChips = Math.log(AutoCookie.AscendMinChips) / Math.log(10);
	var logMaxChips = Math.log(AutoCookie.AscendMaxChips) / Math.log(10);
	var logChips = Math.log(Game.heavenlyChipsEarned) / Math.log(10);

	var scale = 0.0;
	if (heavenlyChips >= AutoCookie.AscendMinChips) {
		if (heavenlyChips >= AutoCookie.AscendMaxChips) {
			scale = 1.0;
		}
		else {
			scale = (logChips - logMinChips) / (logMaxChips - logMinChips);
			scale = Math.sqrt(1 - Math.pow(1 - scale, 2));
		}
	}

	var multiplier = AutoCookie.AscendMaxMultiplier + (1.0 - scale) * (AutoCookie.AscendMinMultiplier - AutoCookie.AscendMaxMultiplier);
	var nextAscend = Game.heavenlyChipsEarned * (multiplier - 1);

	if (heavenlyChips < AutoCookie.AscendMinChips) {
		multiplier = 0;
		scale = 0.0;
		nextAscend = AutoCookie.AscendMinChips;
	}

	AutoCookie.ChipsForAscend = nextAscend;

	if (lAuto('nextAscend') != null) {
		lAuto('nextAscend').innerHTML =
			Beautify(AutoCookie.ChipsForAscend) +
			' <small>(scale : ' + Beautify(scale, 4) + '  multiplier : ' + Beautify(multiplier) + ')</small>' +
			(ascendNowToGet >= nextAscend ? ' Ready'.fontcolor('green') : '');
	}
}

//============ MODES ============

AutoCookie.UpdateButtons = function () {

	for (var i in AutoCookie.Actions) {
		if (lAuto(i + 'Button') != null) {
			AutoCookie.SetButtonVisual(i);
		}
	}
}

AutoCookie.GetNumber = function (inputID) {
	var numNames = [
		' million', ' billion', ' trillion', ' quadrillion', ' quintillion', ' sextillion', ' septillion', ' octillion',
		' nonillion', ' decillion', ' undecillion', ' duodecillion', ' tredecillion', ' quattuordecillion', ' quindecillion'
	];
	var numNames2 = [' M', ' B', ' T', ' Qa', ' Qi', ' Sx', ' Sp', ' Oc', ' No', ' Dc', ' UnD', ' DoD', ' TrD', ' QaD', ' QiD'];

	var text = lAuto(inputID).value;
	// Remove commas and set to lowercase
	text = text.replace(',', '').toLowerCase();
	var place = 1, multiplier = 1, value = NaN;

	for (var i = 0; i < numNames.length; i++) {
		place++;

		var numName = numNames[i].toLowerCase();
		var index1 = text.indexOf(numName);
		if (index1 != -1 && index1 == text.lastIndexOf(numName)) {
			multiplier = Math.pow(10, place * 3);
			text = text.replace(numName, ' ');
			break;
		}
		numName = numNames2[i].toLowerCase();
		index1 = text.indexOf(numName);
		if (index1 != -1 && index1 == text.lastIndexOf(numName)) {
			multiplier = Math.pow(10, place * 3);
			text = text.replace(numName, ' ');
			break;
		}
	}
	text = text.replace(' ', '');
	if (/^(\-|\+)?(([0-9]+\.?[0-9]*)|(\.[0-9]+)|Infinity)$/.test(text)) {
		value = parseFloat(text);
		value *= multiplier;
		Math.floor(value);
	}

	return value;
}
AutoCookie.GetNumberSimple = function (inputID) {
	
	var text = lAuto(inputID).value;
	var value = NaN;
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(text)) {
		value = parseInt(text);
	}

	return value;
}
AutoCookie.GetNumberSimplePercentage = function (inputID) {
	
	var text = lAuto(inputID).value;
	if (text.indexOf('%') == text.lastIndexOf('%'))
		text = text.replace('%', '');
	var value = NaN;
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(text)) {
		value = parseInt(text);
	}

	return value;
}
AutoCookie.CheckAutoClick = function () {
	
	if (lAuto('clickRateInput') != null) {
		var invalid = true;

		var newRate = Math.floor(AutoCookie.GetNumberSimple('clickRateInput'));

		if (!isNaN(newRate)) {
			if (newRate < 1) {
				//newRate = 1;
			}
			else if (newRate > 250) {
				//newRate = 250;
			}
			else {
				invalid = false;
				if (newRate != AutoCookie.AutoClickRate) {
					AutoCookie.AutoClickRate = newRate;

					AutoCookie.Actions['autoclick'].Delay = Math.floor(1000.0 / AutoCookie.AutoClickRate);
					AutoCookie.Actions['autoclick'].Action(false);
					AutoCookie.Actions['autoclick'].Action(false);
				}
			}
		}
		lAuto('clickRateInput').style.color = (invalid ? '#F00' : '#FFF');
	}
}
AutoCookie.CheckAscendInputs = function () {

	var updated = false;

	if (lAuto('ascendMinChips') != null) {
		var invalid = true;
		var newMinChips = Math.floor(AutoCookie.GetNumber('ascendMinChips'));

		if (!isNaN(newMinChips) && newMinChips >= 1 && newMinChips < AutoCookie.AscendMaxChips) {
			invalid = false;
			if (newMinChips != AutoCookie.AscendMinChips) {
				AutoCookie.AscendMinChips = newMinChips;
				updated = true;
			}
		}
		lAuto('ascendMinChips').style.color = (invalid ? '#F00' : '#FFF');
	}
	if (lAuto('ascendMaxChips') != null) {
		var invalid = true;
		var newMaxChips = Math.floor(AutoCookie.GetNumber('ascendMaxChips'));

		if (!isNaN(newMaxChips) && newMaxChips >= 1 && newMaxChips > AutoCookie.AscendMinChips) {
			invalid = false;
			if (newMaxChips != AutoCookie.AscendMaxChips) {
				AutoCookie.AscendMaxChips = newMaxChips;
				updated = true;
			}
		}
		lAuto('ascendMaxChips').style.color = (invalid ? '#F00' : '#FFF');
	}
	if (lAuto('ascendMinMultiplier') != null) {
		var invalid = true;
		var newMinMult = Math.floor(AutoCookie.GetNumber('ascendMinMultiplier'));

		if (!isNaN(newMinMult) && newMinMult >= 1 && newMinMult > AutoCookie.AscendMaxMultiplier) {
			invalid = false;
			if (newMinMult != AutoCookie.AscendMinMultiplier) {
				AutoCookie.AscendMinMultiplier = newMinMult;
				updated = true;
			}
		}
		lAuto('ascendMinMultiplier').style.color = (invalid ? '#F00' : '#FFF');
	}
	if (lAuto('ascendMaxMultiplier') != null) {
		var invalid = true;
		var newMaxMult = Math.floor(AutoCookie.GetNumber('ascendMaxMultiplier'));

		if (!isNaN(newMaxMult) && newMaxMult >= 1 && newMaxMult < AutoCookie.AscendMinMultiplier) {
			invalid = false;
			if (newMaxMult != AutoCookie.AscendMaxMultiplier) {
				AutoCookie.AscendMaxMultiplier = newMaxMult;
				updated = true;
			}
		}
		lAuto('ascendMaxMultiplier').style.color = (invalid ? '#F00' : '#FFF');
	}
	
	if (lAuto('chipsForCookies') != null) {
		var invalid = true;
		var newChips = Math.floor(AutoCookie.GetNumberSimplePercentage('chipsForCookies'));

		if (!isNaN(newChips) && newChips >= 0 && newChips <= 100) {
			invalid = false;
			if (newChips != AutoCookie.ChipsForCookies) {
				AutoCookie.ChipsForCookies = newChips;
				updated = true;
			}
		}
		lAuto('chipsForCookies').style.color = (invalid ? '#F00' : '#FFF');
	}

	if (updated)
		AutoCookie.UpdateAscendInfo();
}
/* Enables all important modes. */
AutoCookie.EnabledAll = function () {
	AutoCookie.Actions['autoclick'].Enable(false);
	AutoCookie.Actions['gold'].Enable(false);
	AutoCookie.Actions['wrath'].Enable(false);
	AutoCookie.Actions['wrinkler'].Enable(false);
	AutoCookie.Actions['reindeer'].Enable(false);

	AutoCookie.Actions['autobuildings'].Enable(false);
	AutoCookie.Actions['autoupgrades'].Enable(false);
	AutoCookie.Actions['autoresearch'].Enable(false);
	AutoCookie.Actions['autoseason'].Enable(false);
	AutoCookie.Actions['autoascend'].Enable(false);

	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}
/* Disables all modes. */
AutoCookie.DisableAll = function () {
	AutoCookie.Actions['autoclick'].Disable(false);
	AutoCookie.Actions['gold'].Disable(false);
	AutoCookie.Actions['wrath'].Disable(false);
	AutoCookie.Actions['wrinkler'].Disable(false);
	AutoCookie.Actions['reindeer'].Disable(false);

	AutoCookie.Actions['autobuildings'].Disable(false);
	AutoCookie.Actions['autoupgrades'].Disable(false);
	AutoCookie.Actions['autoresearch'].Disable(false);
	AutoCookie.Actions['autoseason'].Disable(false);
	AutoCookie.Actions['autoascend'].Disable(false);

	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}
/* Enables all important modes. */
AutoCookie.EnabledAllClick = function () {
	AutoCookie.Actions['autoclick'].Enable(false);
	AutoCookie.Actions['gold'].Enable(false);
	AutoCookie.Actions['wrath'].Enable(false);
	AutoCookie.Actions['wrinkler'].Enable(false);
	AutoCookie.Actions['reindeer'].Enable(false);

	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}
/* Disables all modes. */
AutoCookie.DisableAllClick = function () {
	AutoCookie.Actions['autoclick'].Disable(false);
	AutoCookie.Actions['gold'].Disable(false);
	AutoCookie.Actions['wrath'].Disable(false);
	AutoCookie.Actions['wrinkler'].Disable(false);
	AutoCookie.Actions['reindeer'].Disable(false);


	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}
/* Enables all important modes. */
AutoCookie.EnabledAllBuy = function () {
	AutoCookie.Actions['autobuildings'].Enable(false);
	AutoCookie.Actions['autoupgrades'].Enable(false);
	AutoCookie.Actions['autoresearch'].Enable(false);
	AutoCookie.Actions['autoseason'].Enable(false);

	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}
/* Disables all modes. */
AutoCookie.DisableAllBuy = function () {
	AutoCookie.Actions['autobuildings'].Disable(false);
	AutoCookie.Actions['autoupgrades'].Disable(false);
	AutoCookie.Actions['autoresearch'].Disable(false);
	AutoCookie.Actions['autoseason'].Disable(false);

	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}

/* Auto-clicks the big cookie. */
AutoCookie.AutoClick = function () {
	Game.ClickCookie();
}
/* Clicks the golden cookies. */
AutoCookie.ClickGoldenCookies = function () {
	// Prevent dealing with golden cookies while ascended.
	if (!Game.AscendTimer && !Game.OnAscend) {
		if (Game.goldenCookie.life > 0 && (Game.goldenCookie.wrath == 0 || AutoCookie.Actions['wrath'].Enabled)) {
			Game.goldenCookie.click();
			if (AutoCookie.Actions['gnotify'].Enabled)
				AutoCookie.NotifySound.play();
		}
	}
}
/* Auto-clicks the big cookie. */
AutoCookie.ToggleWrath = function () {

}
/* Alerts when golden cookies appear. */
AutoCookie.GoldenCookieAlert = function () {
	// Prevent dealing with golden cookies while ascended.
	if (!Game.AscendTimer && !Game.OnAscend) {
		if (Game.goldenCookie.life > 0 && (Game.goldenCookie.wrath == 0 || AutoCookie.Actions['wrath'].Enabled) && !AutoCookie.Actions['gold'].Enabled)
			AutoCookie.NotifySound.play();
	}
}
/* Pops wrinklers when they appear. */
AutoCookie.PopWrinklers = function () {
	for (var i in Game.wrinklers) {
		var me = Game.wrinklers[i];
		if (me.phase == 2) {
			me.hp = 0;
		}
	}
}
/* Clicks a reindeer if one exists. */
AutoCookie.ClickReindeer = function () {
	// This is what happens when a reindeer is clicked. There's no function for it.
	var me = Game.seasonPopup;
	if (me.life > 0) {
		if (me.type == 'reindeer') {
			me.toDie = 1;
			Game.reindeerClicked++;

			var moni = Math.max(25, Game.cookiesPs * 60 * 1); //1 minute of cookie production, or 25 cookies - whichever is highest
			if (Game.Has('Ho ho ho-flavored frosting'))
				moni *= 2;
			Game.Earn(moni);

			var failRate = 0.8;
			var cookie = '';
			if (Game.HasAchiev('Let it snow'))
				failRate = 0.6;
			if (Game.Has('Santa\'s bottomless bag'))
				failRate *= 0.9;
			if (Game.Has('Starsnow'))
				failRate *= 0.95;
			if (Math.random() > failRate) {//christmas cookie drops
				cookie = choose(['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits']);
				if (!Game.HasUnlocked(cookie) && !Game.Has(cookie)) {
					Game.Unlock(cookie);
				}
				else cookie = '';
			}

			if (Game.prefs.popups)
				Game.Popup('You found ' + choose(['Dasher', 'Dancer', 'Prancer', 'Vixen', 'Comet', 'Cupid', 'Donner', 'Blitzen', 'Rudolph']) + '!<br>The reindeer gives you ' + Beautify(moni) + ' cookies.' + (cookie == '' ? '' : '<br>You are also rewarded with ' + cookie + '!'));
			else
				Game.Notify('You found ' + choose(['Dasher', 'Dancer', 'Prancer', 'Vixen', 'Comet', 'Cupid', 'Donner', 'Blitzen', 'Rudolph']) + '!', 'The reindeer gives you ' + Beautify(moni) + ' cookies.' + (cookie == '' ? '' : '<br>You are also rewarded with ' + cookie + '!'), [12, 9], 6);

			l('seasonPopup').style.display = 'none';
			me.minTime = me.getMinTime();
			me.maxTime = me.getMaxTime();
		}
	}
}

/* Autobuys the next item. */
AutoCookie.Autobuy = function () {
	// Prevent buying while ascended.
	if (!Game.AscendTimer && !Game.OnAscend) {
		var next = AutoCookie.Calc.FindBest();
		AutoCookie.NextItem = next;
		if (lAuto('nextItem') != null) {
			//lAuto('nextItem').innerHTML = (AutoCookie.NextItem.Type != 'invalid' ? ('Next ' + AutoCookie.NextItem.Type + ': ' + AutoCookie.NextItem.Name) : '');
			lAuto('nextItem').innerHTML = (AutoCookie.NextItem.Type != 'invalid' ? AutoCookie.NextItem.Name : 'N/A');
			lAuto('nextType').innerHTML = 'Next ' + (AutoCookie.NextItem.Type != 'invalid' ? AutoCookie.NextItem.Type : 'item') + ' : ';
		}
		if (next.Type != 'invalid') {
			if (next.Price <= Game.cookies) {
				next.Buy();
			}
		}
	}

	// Since this function always runs, check to see if reincarnation is happening and reset the seasons
	else {
		if (AutoCookie.Season.CycleComplete ||
			AutoCookie.Season.XmasUnlocked ||
			AutoCookie.Season.ValentinesUnlocked ||
			AutoCookie.Season.EasterUnlocked ||
			AutoCookie.Season.HalloweenUnlocked) {

			AutoCookie.Season = new Seasons();
		}
	}
}
/* Buys the next building. */
AutoCookie.NextBuilding = function () {
	var next = AutoCookie.Calc.FindBestBuilding();

	if (next.Type != 'invalid') {
		if (next.Price <= Game.cookies)
			next.Buy();
	}
}
/* Buys the next upgrade. */
AutoCookie.NextUpgrade = function () {
	var next = AutoCookie.Calc.FindBestUpgrade();

	if (next.Type != 'invalid') {
		if (next.Price <= Game.cookies)
			next.Buy();
	}
}
/* Buys the next research. */
AutoCookie.NextResearch = function () {
	var next = AutoCookie.Calc.FindBestResearch();

	if (next.Type != 'invalid') {
		if (next.Price <= Game.cookies)
			next.Buy();
	}
}
/* Cycles through every season to collect upgrades. */
AutoCookie.SeasonCycle = function () {
	
}
/* Automatically ascends when the heavenly chip threshold is reached. */
AutoCookie.AutoAscend = function () {
	if (!Game.AscendTimer && !Game.OnAscend && !Game.promptOn) {
		//var ascendMultiplier = 2.0;
		var ascendNowToGet = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset));

		//if (ascendNowToGet > Game.heavenlyChipsEarned * (ascendMultiplier - 1.0) && ascendNowToGet >= 2000) {
		AutoCookie.UpdateAscendInfo();

		if (ascendNowToGet >= AutoCookie.ChipsForAscend) {
			AutoCookie.ShowAscendPrompt();
		}
	}
	else if (Game.OnAscend && !AutoCookie.ManualAscend) {

		var hchipsCookies = Game.heavenlyChips * (AutoCookie.ChipsForCookies / 100.0);
		var hchipsUpgrades = Game.heavenlyChips * (1.0 - AutoCookie.ChipsForCookies / 100.0);

		//======== Buy Upgrades ========

		// Prices are only there for reference. They're not actually used
		var upgradeOrder = [
			{ name: 'Heavenly luck', price: 7, slot: false },
			{ name: 'Season switcher', price: 50, slot: false },
			{ name: 'Box of british tea biscuits', price: 10, slot: false },
			{ name: 'Box of macarons', price: 10, slot: false },
			{ name: 'Box of brand biscuits', price: 10, slot: false },
			{ name: 'Starter kit', price: 50, slot: false },
			{ name: 'Lasting fortune', price: 77, slot: false },

			{ name: 'Permanent upgrade slot I', price: 100, slot: true },
			{ name: 'Divine discount', price: 100, slot: false },
			{ name: 'Divine sales', price: 100, slot: false },
			{ name: 'Divine bakeries', price: 100, slot: false },

			{ name: 'Permanent upgrade slot II', price: 1000, slot: true },
			{ name: 'Decisive fate', price: 777, slot: false },
			{ name: 'Starter kitchen', price: 5000, slot: false },
			{ name: 'Unholy bait', price: 9000, slot: false },

			{ name: 'Angels', price: 1, slot: false },
			{ name: 'Archangels', price: 10, slot: false },
			{ name: 'Virtues', price: 100, slot: false },
			{ name: 'Dominions', price: 1000, slot: false },
			{ name: 'Kitten angels', price: 50000, slot: false },

			{ name: 'Halo gloves', price: 50000, slot: false },
			
			{ name: 'Starspawn', price: 10000, slot: false },
			{ name: 'Starsnow', price: 10000, slot: false },
			{ name: 'Starterror', price: 10000, slot: false },
			{ name: 'Starlove', price: 10000, slot: false },
			{ name: 'Startrade', price: 10000, slot: false },
			
			{ name: 'Permanent upgrade slot III', price: 100000, slot: true },

			{ name: 'Sacrilegious corruption', price: 900000, slot: false },

			{ name: 'Permanent upgrade slot IV', price: 10000000, slot: true },
			{ name: 'Permanent upgrade slot V', price: 1000000000, slot: true },

			{ name: 'Cherubim', price: 10000, slot: false },
			{ name: 'Seraphim', price: 100000, slot: false },
			{ name: '"god"', price: 1000000, slot: false },
			{ name: '"devil"', price: 10000000, slot: false }
		];

		var numUpgradeSlots = 0;
		for (var i = 0; i < upgradeOrder.length; i++) {
			var info = upgradeOrder[i];
			var name = info.name;
			var upgrade = Game.Upgrades[name];

			if (!upgrade.bought) {

				if (hchipsUpgrades >= upgrade.getPrice()) {
					if (name != '"devil"' || AutoCookie.PurchaseDevil) {
						upgrade.buy(true);
						hchipsUpgrades -= upgrade.getPrice();
						Game.ClosePrompt();
						if (info.slot) {
							numUpgradeSlots++;
						}
					}
				}
				else {
					break;
				}
			}
			else if (info.slot) {
				numUpgradeSlots++;
			}
		}

		//======== Assign Permanent Upgrades ========

		var permanentUpgrades = [
			'Persistent memory',

			'Omelette',
			'Cookie egg',
			'Wrinklerspawn',
			'Golden goose egg',
			'Faberge egg',
			'Century egg',

			'Octillion fingers',
			'Septillion fingers',
			'Sextillion fingers',
			'Quintillion fingers',
			'Quadrillion fingers'
		];

		var upgradeIndex = 0;
		for (var i = 0; i < numUpgradeSlots; i++) {

			for (var j = upgradeIndex; j < permanentUpgrades.length; j++) {
				upgradeIndex++;

				var name = permanentUpgrades[j];
				var upgrade = Game.Upgrades[name];

				console.log(name);

				if (upgrade.bought) {
					AutoCookie.AssignPermanentSlot(i, name);
					break;
				}
			}
		}

		//======== Bake Heavenly Cookies ========

		// Buy as many heavenly cookies as possible
		var amount = (hchipsCookies - hchipsCookies % 10) / 10;
		Game.heavenlyCookies += amount;
		Game.heavenlyChips -= amount * 10;
		Game.heavenlyChipsSpent += amount * 10;

		Game.Notify('Bake Heavenly Chips', 'Baked ' + Beautify(amount) + ' heavenly cookies.', [20, 7])

		//======== Reincarnate ========

		Game.Reincarnate(true);


		AutoCookie.ManualAscend = true;
		// Reset the season
		//AutoCookie.Season = new Seasons();
	}
}

AutoCookie.AssignPermanentSlot = function (slot, upgrade) {
	Game.SelectingPermanentUpgrade = Game.Upgrades[upgrade].id;

	/*var list = [];
	for (var i in Game.Upgrades) {
		var me = Game.Upgrades[i];
		if (me.bought && me.unlocked && (me.pool == '' || me.pool == 'cookie')) list.push(me);
	}

	var sortMap = function (a, b) {
		if (a.order > b.order) return 1;
		else if (a.order < b.order) return -1;
		else return 0;
	}
	list.sort(sortMap);

	var upgrades = '';
	for (var i in list) {
		var me = list[i];
		upgrades += '<div class="crate upgrade enabled" ' + Game.getTooltip(
		'<div style="min-width:200px;"><div style="float:right;"><span class="price">' + Beautify(Math.round(me.getPrice())) + '</span></div><small>' + (me.pool == 'toggle' ? '[Togglable]' : '[Upgrade]') + '</small><div class="name">' + me.name + '</div><div class="description">' + me.desc + '</div></div>'
		, 'bottom-left') + ' ' + Game.clickStr + '="Game.PutUpgradeInPermanentSlot(' + me.id + ',' + slot + ');" id="upgrade' + me.id + '" style="' + (me.icon[2] ? 'background-image:url(' + me.icon[2] + ');' : '') + 'background-position:' + (-me.icon[0] * 48) + 'px ' + (-me.icon[1] * 48) + 'px;"></div>';
	}
	var upgrade = Game.permanentUpgrades[slot];
	Game.SelectingPermanentUpgrade = upgrade;
	Game.Prompt('<h3>Pick an upgrade to make permanent</h3>' +
				'<div style="margin:4px auto;clear:both;width:120px;"><div class="crate upgrade enabled" style="background-position:' + (-slot * 48) + 'px ' + (-10 * 48) + 'px;"></div><div id="upgradeToSlot" class="crate upgrade enabled" style="background-position:' + (upgrade == -1 ? ((-0 * 48) + 'px ' + (-7 * 48) + 'px') : ((-Game.UpgradesById[upgrade].icon[0] * 48) + 'px ' + (-Game.UpgradesById[upgrade].icon[1] * 48) + 'px')) + ';"></div></div>' +
				'<div class="block" style="overflow-y:scroll;float:left;clear:left;width:317px;padding-left:0px;padding-right:0px;height:250px;">' + upgrades + '</div>' +
				'<div class="block" style="float:right;width:152px;clear:right;height:250px;"><p>Here are all the upgrades you\'ve purchased last playthrough.</p><p>Pick one to permanently gain its effects!</p><p>You can reassign this slot anytime you ascend.</p></div>'
				, [['Confirm', 'Game.permanentUpgrades[' + slot + ']=Game.SelectingPermanentUpgrade;Game.ClosePrompt();'], 'Cancel'], 0, 'widePrompt');*/
}

AutoCookie.ShowAscendPrompt = function () {
	AutoCookie.AutoAscendStartTime = new Date().getTime();
	AutoCookie.AutoAscendTimer = 60;

	var str = '<h3>Legacy</h3>';
	str += '<div class="block" id="' + iAuto('ascendPromptData') + '" style="overflow:hidden;position:relative;text-align:center;"></div>';
	Game.Prompt(str, [['Auto', 'Game.ClosePrompt(); Game.Ascend(true); AutoCookie.ManualAscend = false;'], ['Manual', 'Game.ClosePrompt(); Game.Ascend(true); AutoCookie.ManualAscend = true;'], ['Disable', 'Game.ClosePrompt(); AutoCookie.Actions["autoascend"].Disable(); AutoCookie.UpdateButtons();']], AutoCookie.UpdateAscendPrompt, 'legacyPrompt');

	//l('promptOption2').style.display = 'none';
	Game.UpdatePrompt();

	l('promptOption0').className = 'option framed large title';
	l('promptOption0').style.marginRight = '4px';

	l('promptOption1').className = 'option framed large title';
	l('promptOption1').style.marginLeft = '4px';
	l('promptOption1').style.marginRight = '4px';

	l('promptOption2').className = 'option framed large title';
	l('promptOption2').style.marginLeft = '4px';

}

AutoCookie.UpdateAscendPrompt = function () {
	if (!lAuto('ascendPromptData')) return 0;
	var date = new Date();
	date.setTime(new Date().getTime() - Game.startDate);
	var timeInSeconds = date.getTime() / 1000;
	var startDate = Game.sayTime(timeInSeconds * Game.fps, 2);

	var ascendNowToGet = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset));
	var cookiesToNext = Math.floor(Game.HowManyCookiesReset(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) + 1) - Game.cookiesReset - Game.cookiesEarned);


	var timer = 60 - ((new Date().getTime() - AutoCookie.AutoAscendStartTime) / 1000);
	AutoCookie.AutoAscendTimer = Math.floor(Math.max(0, timer));

	lAuto('ascendPromptData').innerHTML = '' +
		'<div class="icon" style="pointer-event:none;transform:scale(2);opacity:0.25;position:absolute;right:-8px;bottom:-8px;background-position:' + (-19 * 48) + 'px ' + (-7 * 48) + 'px;"></div>' +
		'<div class="listing"><b>Run duration :</b> ' + (startDate == '' ? 'tiny' : (startDate)) + '</div>' +
		//'<div class="listing">Earned : '+Beautify(Game.cookiesEarned)+', Reset : '+Beautify(Game.cookiesReset)+'</div>'+
		'<div class="listing"><b>Heavenly chips :</b> ' + Beautify(Game.heavenlyChips) + '</div>' +
		'<div class="listing"><b>Ascending now will produce :</b> ' + Beautify(ascendNowToGet) + ' heavenly chip' + ((ascendNowToGet) == 1 ? '' : 's') + '</div>' +
		'<div class="listing"><b>Auto ascend in :</b> ' + Beautify(AutoCookie.AutoAscendTimer) + ' second' + ((AutoCookie.AutoAscendTimer) == 1 ? '' : 's') + '</div>' +
		'';
	/*l('promptOption0').className = 'option framed large title';
	l('promptOption0').style.marginRight = '4px';
	//l('promptOption0').style.display = 'none';
	l('promptOption1').className = 'option framed large title';
	l('promptOption1').style.marginLeft = '4px';
	l('promptOption1').style.marginRight = '4px';
	//l('promptOption1').style.display = 'none';
	l('promptOption2').className = 'option framed large title';
	l('promptOption2').style.marginLeft = '4px';*/

	if (timer < 0) {
		console.log(timer);
		Game.ClosePrompt();
		Game.Ascend(true);
		AutoCookie.ManualAscend = false;
	}
	//if (ascendNowToGet >= 1) l('promptOption0').style.display = 'inline-block'; else l('promptOption0').style.display = 'none';
}

AutoCookie.ToggleAllowDevil = function () {
	AutoCookie.PurchaseDevil = AutoCookie.Actions['allowdevil'].Enabled;
}

/*=====================================================================================
AUTO-COOKIE BUYOUT ITEM
=======================================================================================*/

function BuyoutItem(name, type, priority, price, time) {
	this.Name		= name || '';
	this.Type		= type || 'invalid';
	this.Priority	= priority || 0;
	this.Price		= price || 0;
	this.Time		= time || 0;
	this.Afford		= price <= Game.cookies;
}

BuyoutItem.prototype.Buy = function () {
	if (this.Type == 'building')
		Game.Objects[this.Name].buy();
	else if (this.Type == 'upgrade')
		Game.Upgrades[this.Name].buy(true);
}

/*=====================================================================================
AUTO-COOKIE SEASONS
=======================================================================================*/

function Seasons() {
	this.Seasons			= ['christmas', 'valentines', 'easter', 'halloween', 'fools'];
	this.SeasonTriggers		= {
		christmas:	'Festive biscuit',
		valentines:	'Lovesick biscuit',
		easter:		'Bunny biscuit',
		halloween:	'Ghostly biscuit',
		fools:		'Fool\'s biscuit'
	};

	this.XmasComplete		= false;
	this.XmasUnlocked		= false;
	this.SantaTrigger		= 'A festive hat';
	this.SantaDrops			= ['Increased merriness','Improved jolliness','A lump of coal','An itchy sweater','Reindeer baking grounds','Weighted sleighs','Ho ho ho-flavored frosting','Season savings','Toy workshop','Naughty list','Santa\'s bottomless bag','Santa\'s helpers','Santa\'s legacy','Santa\'s milk and cookies'];
	this.XmasCookies		= ['Christmas tree biscuits','Snowflake biscuits','Snowman biscuits','Holly biscuits','Candy cane biscuits','Bell biscuits','Present biscuits'];

	this.ValentinesComplete	= false;
	this.ValentinesUnlocked	= false;
	this.HeartCookies		= ['Pure heart biscuits', 'Ardent heart biscuits', 'Sour heart biscuits', 'Weeping heart biscuits', 'Golden heart biscuits', 'Eternal heart biscuits'];

	this.EasterComplete		= false;
	this.EasterUnlocked		= false;
	this.EasterEggs			= ['Chicken egg','Duck egg','Turkey egg','Quail egg','Robin egg','Ostrich egg','Cassowary egg','Salmon roe','Frogspawn','Shark egg','Turtle egg','Ant larva','Golden goose egg','Faberge egg','Wrinklerspawn','Cookie egg','Omelette','Chocolate egg','Century egg','"egg"'];
	this.RareEasterEggs		= ['Golden goose egg', 'Faberge egg', 'Wrinklerspawn', 'Cookie egg', 'Omelette', 'Chocolate egg', 'Century egg', '"egg"'];

	this.HalloweenComplete	= false;
	this.HalloweenUnlocked	= false;
	this.SpookyCookies		= ['Skull cookies','Ghost cookies','Bat cookies','Slime cookies','Pumpkin cookies','Eyeball cookies','Spider cookies'];

	this.CycleComplete		= false;

	this.NewSeason			= '';
	this.BestUpgrade		= new BuyoutItem();
	
	this.HasFestiveHat		= false;
	this.SantaDropsNum		= 0;
	this.XmasCookiesNum		= 0;

	this.HeartCookiesNum	= 0;
	this.SpookyCookiesNum	= 0;
	this.EasterEggsNum		= 0;
	this.RareEasterEggsNum	= 0;
}

Seasons.prototype.FindBest = function () {
	this.Update();

	this.BestUpgrade = new BuyoutItem();

	// Upgrade the jolly old man so he can deliver to more and more little kiddies
	if (Game.santaLevel < 14) {
		this.UpgradeSanta();
	}

	if (this.NewSeason != '') {
		var name = this.SeasonTriggers[this.NewSeason];
		this.BestUpgrade = new BuyoutItem(name, 'upgrade', 13, Game.Upgrades[name].getPrice());
		this.NewSeason = '';
	}

	if (!this.CycleComplete) {

		if (!this.XmasComplete) {
			// Buy Santa trigger
			if (Game.HasUnlocked(this.SantaTrigger) && !Game.Has(this.SantaTrigger) && this.BestUpgrade.Priority < 12) {
				this.BestUpgrade = new BuyoutItem(this.SantaTrigger, 'upgrade', 12, Game.Upgrades[this.SantaTrigger].getPrice());
			}
		
			if (this.BestUpgrade.Priority < 12) {
				// Buy Santa drops
				for (var i = 0; i < this.SantaDrops.length; i++) {
					var name = this.SantaDrops[i];

					if (Game.HasUnlocked(name) && !Game.Has(name) && (Game.Upgrades[name].getPrice() < this.BestUpgrade.Price || this.BestUpgrade.Type == 'invalid'))
						this.BestUpgrade = new BuyoutItem(name, 'upgrade', 11, Game.Upgrades[name].getPrice());
				}
				// Buy xmas cookies
				for (var i = 0; i < this.XmasCookies.length; i++) {
					var name = this.XmasCookies[i];
				
					if (Game.HasUnlocked(name) && !Game.Has(name) && (Game.Upgrades[name].getPrice() < this.BestUpgrade.Price || this.BestUpgrade.Type == 'invalid'))
						this.BestUpgrade = new BuyoutItem(name, 'upgrade', 11, Game.Upgrades[name].getPrice());
				}
			}
		}
		if (!this.ValentinesComplete && this.BestUpgrade.Priority < 12) {
			for (var i = 0; i < this.HeartCookies.length; i++) {
				var name = this.HeartCookies[i];
			
				if (Game.HasUnlocked(name) && !Game.Has(name) && (Game.Upgrades[name].getPrice() < this.BestUpgrade.Price || this.BestUpgrade.Type == 'invalid'))
					this.BestUpgrade = new BuyoutItem(name, 'upgrade', 11, Game.Upgrades[name].getPrice());
			}
		}
		if (!this.EasterComplete && this.BestUpgrade.Priority < 12) {
			for (var i = 0; i < this.EasterEggs.length; i++) {
				var name = this.EasterEggs[i];
			
				if (Game.HasUnlocked(name) && !Game.Has(name) && (Game.Upgrades[name].getPrice() < this.BestUpgrade.Price || this.BestUpgrade.Type == 'invalid'))
					this.BestUpgrade = new BuyoutItem(name, 'upgrade', 11, Game.Upgrades[name].getPrice());
			}
		}
		if (!this.HalloweenComplete && this.BestUpgrade.Priority < 12) {
			for (var i = 0; i < this.SpookyCookies.length; i++) {
				var name = this.SpookyCookies[i];
			
				if (Game.HasUnlocked(name) && !Game.Has(name) && (Game.Upgrades[name].getPrice() < this.BestUpgrade.Price || this.BestUpgrade.Type == 'invalid'))
					this.BestUpgrade = new BuyoutItem(name, 'upgrade', 11, Game.Upgrades[name].getPrice());
			}
		}
	}
	else if (Game.season == 'fools') {
		if (!Game.Has('Elder Covenant')) {
			if (Game.HasUnlocked('Elder Covenant')) {
				this.BestUpgrade = new BuyoutItem('Elder Covenant', 'upgrade', 13, Game.Upgrades['Elder Covenant'].getPrice());
			}
			else if (Game.HasUnlocked('Elder Pledge')) {
				this.BestUpgrade = new BuyoutItem('Elder Pledge', 'upgrade', 13, Game.Upgrades['Elder Pledge'].getPrice());
			}
		}
	}

	return this.BestUpgrade;
}
Seasons.prototype.UpgradeSanta = function () {
	if (Game.Has('A festive hat')) {

		// This is the in game code for upgrading santa.
		var moni = Math.pow(Game.santaLevel + 1, Game.santaLevel + 1);
		if (Game.cookies > moni && Game.santaLevel < 14) {
			Game.Spend(moni);
			Game.santaLevel = (Game.santaLevel + 1) % 15;
			if (Game.santaLevel == 14) {
				Game.Unlock('Santa\'s dominion');
				if (Game.prefs.popups)
					Game.Popup('You are granted<br>Santa\'s dominion.');
				else
					Game.Notify('You are granted Santa\'s dominion.', '', Game.Upgrades['Santa\'s dominion'].icon);
			}
			Game.santaTransition = 1;
			var drops = [];
			for (var i in Game.santaDrops) {
				if (!Game.HasUnlocked(Game.santaDrops[i]))
					drops.push(Game.santaDrops[i]);
			}
			var drop=choose(drops);
			if (drop) {
				Game.Unlock(drop);
				if (Game.prefs.popups)
					Game.Popup('You find a present which contains...<br>' + drop + '!');
				else
					Game.Notify('Found a present!', 'You find a present which contains...<br><b>' + drop + '</b>!', Game.Upgrades[drop].icon);
			}
							
			if (Game.santaLevel >= 6)
				Game.Win('Coming to town');
			if (Game.santaLevel >= 14)
				Game.Win('All hail Santa');
		}
		if (Game.santaTransition > 0) {
			Game.santaTransition++;
			if (Game.santaTransition >= Game.fps / 2) Game.santaTransition = 0;
		}
	}
}

Seasons.prototype.Update = function () {
	
	this.NewSeason = '';
	
	this.UpdateXmas();
	this.UpdateValentines();
	this.UpdateEaster();
	this.UpdateHalloween();

	if (Game.season == 'christmas') {
		if (this.XmasComplete) {

			if (!this.ValentinesComplete)
				this.NewSeason = 'valentines';
			else if (!this.EasterComplete)
				this.NewSeason = 'easter';
			else if (!this.HalloweenComplete)
				this.NewSeason = 'halloween';
			else
				this.NewSeason = 'fools';
		}
	}
	else if (Game.season == 'valentines') {
		if (this.ValentinesComplete) {

			if (!this.XmasComplete)
				this.NewSeason = 'christmas';
			else if (!this.EasterComplete)
				this.NewSeason = 'easter';
			else if (!this.HalloweenComplete)
				this.NewSeason = 'halloween';
			else
				this.NewSeason = 'fools';
		}
	}
	else if (Game.season == 'easter') {
		if (this.EasterComplete) {

			if (!this.XmasComplete)
				this.NewSeason = 'christmas';
			else if (!this.ValentinesComplete)
				this.NewSeason = 'valentines';
			else if (!this.HalloweenComplete)
				this.NewSeason = 'halloween';
			else
				this.NewSeason = 'fools';
		}
	}
	else if (Game.season == 'halloween') {
		if (this.HalloweenComplete) {

			if (!this.XmasComplete)
				this.NewSeason = 'christmas';
			else if (!this.ValentinesComplete)
				this.NewSeason = 'valentines';
			else if (!this.EasterComplete)
				this.NewSeason = 'easter';
			else
				this.NewSeason = 'fools';
		}
	}
	else {
		if (!this.XmasComplete)
			this.NewSeason = 'christmas';
		else if (!this.ValentinesComplete)
			this.NewSeason = 'valentines';
		else if (!this.EasterComplete)
			this.NewSeason = 'easter';
		else if (!this.HalloweenComplete)
			this.NewSeason = 'halloween';
		else if (Game.season != 'fools')
			this.NewSeason = 'fools';
	}
	
	if (!Game.Has('Season switcher')) {
		this.NewSeason = '';
	}

	if (!this.CycleComplete) {
		if (this.XmasComplete && this.ValentinesComplete && this.EasterComplete && this.HalloweenComplete) {
			this.CycleComplete = true;
		}
	}
}
Seasons.prototype.UpdateXmas = function () {

	// Check if Xmas is complete
	//if (!this.XmasComplete) {
		this.XmasComplete = true;
		this.XmasUnlocked = true;
		this.SantaDropsNum = 0;
		this.XmasCookiesNum = 0;

		if (Game.santaLevel < 14) {
			this.XmasComplete = false;
			this.XmasUnlocked = false;
		}
		// Check santa trigger
		if (!Game.Upgrades[this.SantaTrigger].bought)
			this.XmasComplete = false;
		else
			this.HasFestiveHat = true;
		this.XmasUnlocked = Game.Upgrades[this.SantaTrigger].unlocked;

		// Check santa drops
		for (var i = 0; i < this.SantaDrops.length; i++) {
			var name = this.SantaDrops[i];
			var drop = Game.Upgrades[name];

			if (!drop.bought)
				this.XmasComplete = false;
			else
				this.SantaDropsNum++;
			if (!drop.unlocked)
				this.XmasUnlocked = false;
		}
		// Check xmas cookies
		for (var i = 0; i < this.XmasCookies.length; i++) {
			var name = this.XmasCookies[i];
			var cookie = Game.Upgrades[name];

			if (!cookie.bought)
				this.XmasComplete = false;
			else
				this.XmasCookiesNum++;
			if (!cookie.unlocked)
				this.XmasUnlocked = false;
		}
	//}
}
Seasons.prototype.UpdateValentines = function () {
	// Check if Valentines is complete
	//if (!this.ValentinesComplete) {
		this.ValentinesComplete = true;
		this.ValentinesUnlocked = true;
		this.HeartCookiesNum = 0;

		// Check heart cookies
		for (var i = 0; i < this.HeartCookies.length; i++) {
			var name = this.HeartCookies[i];
			var cookie = Game.Upgrades[name];

			if (!cookie.bought)
				this.ValentinesComplete = false;
			else
				this.HeartCookiesNum++;
			if (!cookie.unlocked)
				this.ValentinesUnlocked = false;
		}
	//}
}
Seasons.prototype.UpdateEaster = function () {
	// Check if Easter is complete
	//if (!this.EasterComplete) {
		this.EasterComplete = true;
		this.EasterUnlocked = true;
		this.EasterEggsNum = 0;

		// Check Easter eggs
		for (var i = 0; i < this.EasterEggs.length; i++) {
			var name = this.EasterEggs[i];
			var egg = Game.Upgrades[name];

			if (!egg.bought)
				this.EasterComplete = false;
			else
				this.EasterEggsNum++;
			if (!egg.unlocked)
				this.EasterUnlocked = false;
		}

		// Check Rare Easter eggs
		for (var i = 0; i < this.RareEasterEggs.length; i++) {
			var name = this.RareEasterEggs[i];
			var egg = Game.Upgrades[name];

			if (egg.bought)
				this.RareEasterEggsNum++;
		}
	//}
}
Seasons.prototype.UpdateHalloween = function () {
	// Check if Halloween is complete
	//if (!this.HalloweenComplete) {
		this.HalloweenComplete = true;
		this.HalloweenUnlocked = true;
		this.SpookyCookiesNum = 0;

		// Check spooky cookies
		for (var i = 0; i < this.SpookyCookies.length; i++) {
			var name = this.SpookyCookies[i];
			var cookie = Game.Upgrades[name];

			if (!cookie.bought)
				this.HalloweenComplete = false;
			else
				this.SpookyCookiesNum++;
			if (!cookie.unlocked)
				this.HalloweenUnlocked = false;
		}
	//}
}

/*=====================================================================================
AUTO-COOKIE CALCULATOR
=======================================================================================*/
//#region Calculator

function Calculator() {
	
}

Calculator.prototype.EstimatedCPS = function () {
	return Game.cookiesPs * (1 - Game.cpsSucked);
}
Calculator.prototype.CalculateCPSPrice = function (oldCPS, newCPS, price) {
	// Yes, the bonus returned is smaller if it's better
	return price / (newCPS - oldCPS);
}
Calculator.prototype.CalculateBonus = function (building) {
	// Prevent achievements from testing building CPS
	var GameWinBackup = Game.Win;
	Game.Win = function () { };

	var oldCPS = this.EstimatedCPS();

	var price = Math.round(building.price);
	building.amount++; Game.CalculateGains();
	var newCPS = this.EstimatedCPS();
	building.amount--; Game.CalculateGains();
	var time = (price - Game.cookies) / oldCPS;
	var afford = (price <= Game.cookies);
	
	// Restore achievements function
	Game.Win = GameWinBackup;

	return {
		bonus: this.CalculateCPSPrice(oldCPS, newCPS, price),
		cps: newCPS,
		price: price,
		time: time,
		afford: afford
	};
}
Calculator.prototype.FindBestBuilding = function () {
	var buildingNames = ['Cursor', 'Grandma', 'Farm', 'Mine', 'Factory', 'Bank', 'Temple', 'Wizard tower', 'Shipment', 'Alchemy lab', 'Portal', 'Time machine', 'Antimatter condenser', 'Prism'];

	// Find the best building to buy for the greatest CPS-to-Price increase
	var bestItem	= new BuyoutItem();
	var bestBonus	= -1;

	for (var i = 0; i < buildingNames.length; i++) {
		var name		= buildingNames[i];
		var building	= Game.Objects[name];
		var info		= this.CalculateBonus(building);

		// Always buy a building if none exist yet.
		if (building.amount == 0 && bestBonus != 0 && info.afford) {
			bestItem	= new BuyoutItem(name, 'building', 1, info.Price, info.time);
			bestBonus	= 0;
		}

		// If no building has been found yet or its bonus is better than the current best
		else if (bestBonus == -1 || info.bonus <= bestBonus) {
			bestItem	= new BuyoutItem(name, 'building', 1, info.Price, info.time);
			bestBonus	= info.bonus;

			// If you can't afford this building, see if buying other buildings will get you to this one faster
			if (!info.afford) {
				var timeItem	= new BuyoutItem();
				var timeBonus	= -1;

				// Loop through every building to find the best fit
				for (var j = 0; j < buildingNames.length; j++) {
					var name2		= buildingNames[j];
					var building2	= Game.Objects[name2];
					var info2		= this.CalculateBonus(building2);

					// If this building can be afforded
					if (info2.afford) {
						// Get the new time till the building can be bought if this building is purchased.
						var newTime = (info.price - (Game.cookies - info2.price)) / info2.cps;
						if (newTime < info.time && (timeBonus == -1 || newTime < timeBonus)) {
							timeItem	= new BuyoutItem(name2, 'building', 1, info2.Price, info2.time);
							timeBonus	= newTime;
						}
					}
				}

				// If a faster way to this upgrade has been found
				if (timeItem.Type != 'invalid') {
					bestItem	= timeItem;
					// Don't set the bestBonus because the goal is still the main building
				}
			}
		}
	}
	
	AutoCookie.NextBuilding = bestItem;

	return bestItem;
}
Calculator.prototype.FindBestUpgrade = function () {
	var bestItem	= new BuyoutItem();
	var bestValue	= -1;

	for (var i in Game.Upgrades) {
		var upgrade = Game.Upgrades[i];

		// If this upgrade is unlocked but not bought, not togglable, and the cheapest upgrade.
		if (upgrade.unlocked && !upgrade.bought && upgrade.pool != 'toggle' && (bestValue == -1 || upgrade.getPrice() < bestValue)) {
			bestItem	= new BuyoutItem(upgrade.name, 'upgrade', 1, upgrade.getPrice());
			bestValue	= upgrade.getPrice();
		}
	}

	AutoCookie.NextUpgrade = bestItem;

	return bestItem;
}
Calculator.prototype.FindBestResearch = function () {
	var researchNames = [ 'Specialized chocolate chips', 'Designer cocoa beans', 'Ritual rolling pins', 'Underworld ovens', 'One mind', 'Exotic nuts', 'Communal brainsweep', 'Arcane sugar', 'Elder Pact'];

	var bestItem	= new BuyoutItem();
	var bestValue	= -1;

	// Find the next research upgrade to buy
	for (var i = 0; i < researchNames.length; i++) {
		var name	= researchNames[i];
		var upgrade	= Game.Upgrades[name];

		// If the research is unlocked but not bought yet
		if (upgrade.unlocked && !upgrade.bought && bestValue == -1 && upgrade.getPrice() <= Game.cookies) {
			bestItem	= new BuyoutItem(upgrade.name, 'upgrade', 2, upgrade.getPrice());
			bestValue	= upgrade.getPrice();
		}
	}

	AutoCookie.NextResearch = bestItem;
	
	return bestItem;
}
Calculator.prototype.FindBestSeason = function () {
	return AutoCookie.Season.FindBest();
}

Calculator.prototype.FindBest = function () {
	
	var itemList = [];

	if (AutoCookie.Actions['autoresearch'].Enabled)
		itemList.push(this.FindBestResearch());
	if (AutoCookie.Actions['autoupgrades'].Enabled)
		itemList.push(this.FindBestUpgrade());
	if (AutoCookie.Actions['autobuildings'].Enabled)
		itemList.push(this.FindBestBuilding());
	if (AutoCookie.Actions['autoseason'].Enabled)
		itemList.push(this.FindBestSeason());
	
	var maxItem		= new BuyoutItem();

	for (var i = 0; i < itemList.length; i++) {
		var item = itemList[i];

		if (maxItem.Type == 'invalid') {
			maxItem = item;
		}
		else if (item.Priority > maxItem.Priority && item.Afford) {
			maxItem = item;
		}
		else if (item.Price < maxItem.Price && !maxItem.Afford) {
			maxItem = item;
		}
	}

	AutoCookie.NextItem = maxItem;

	return maxItem;
}

//#endregion
/*=====================================================================================
AUTO-COOKIE ACTION
=======================================================================================*/

/* Writes the action button. */
AutoCookie.WriteButton = function (name) {
	var action = AutoCookie.Actions[name];
	var button = iAuto(name + 'Button');

	if (action.Type == 'toggle') {
		var on = action.ButtonName + ' ON'.fontcolor('green');
		var off = action.ButtonName + ' OFF'.fontcolor('red');
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="AutoCookie.Toggle(\'' + name + '\',\'' + button + '\');">' + (action.Enabled ? on : off) + '</a>';
	}
	else if (action.Type == 'basic') {
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="AutoCookie.Actions[\'' + name + '\'].Action();">' + action.ButtonName + '</a>';
	}
}
/* Toggles the action button function. */
AutoCookie.Toggle = function (name, button) {
	AutoCookie.Actions[name].Action();
	var action = AutoCookie.Actions[name];
	if (action.Enabled) {
		lAuto(button).innerHTML = action.ButtonName + ' ON'.fontcolor('green');
		lAuto(button).className = 'option enabled';
	}
	else {
		lAuto(button).innerHTML = action.ButtonName + ' OFF'.fontcolor('red');
		lAuto(button).className = 'option';
	}
}
/* Toggles the action button function. */
AutoCookie.SetButtonVisual = function (name) {
	var action = AutoCookie.Actions[name];
	var button = iAuto(name + 'Button');
	if (action.Type == 'toggle') {
		if (action.Enabled) {
			lAuto(button).innerHTML = action.ButtonName + ' ON'.fontcolor('green');
			lAuto(button).className = 'option enabled';
		}
		else {
			lAuto(button).innerHTML = action.ButtonName + ' OFF'.fontcolor('red');
			lAuto(button).className = 'option';
		}
	}
}

/* The Auto-Cookie Action object. */
function AutoCookieAction(name, buttonName, icon, type, enabled, delay, func, showNotify, notifyTitle, notifyDescOn, notifyDescOff) {
	this.Name		= name;
	this.ButtonName = (buttonName == null ? name : buttonName);
	this.Icon		= icon;
	this.Type		= type;
	this.Enabled	= enabled;
	this.Delay		= delay;
	this.Func		= func;
	this.ShowNotify = showNotify;
	this.ID			= 0;

	this.NotifyTitle	= notifyTitle || name;
	this.NotifyDescOn	= notifyDescOn || ('Mode ' + 'Activated'.fontcolor('green'));
	this.NotifyDescOff	= notifyDescOff || ('Mode ' + 'Deactivated'.fontcolor('red'));

	if (enabled) {
		this.Enable(false);
	}
}
/* Calls the action. */
AutoCookieAction.prototype.Action = function (notify) {
	if (this.Type == 'toggle') {
		this.Enabled = !this.Enabled;
		if (this.Delay)
			this.ID = this.ID ? clearInterval(this.ID) : setInterval(this.Func, this.Delay);
		else
			this.Func();
		if ((typeof notify !== 'undefined' ? notify : true) && this.ShowNotify)
			Game.Notify(this.NotifyTitle, (this.Enabled ? this.NotifyDescOn : this.NotifyDescOff), this.Icon);
	}
	else if (this.Type == 'basic') {
		this.Func();
		if ((typeof notify !== 'undefined' ? notify : true) && this.ShowNotify)
			Game.Notify(this.NotifyTitle, this.NotifyDescOn, this.Icon);
	}
}
/* Enables the action. */
AutoCookieAction.prototype.Enable = function (notify) {
	if (this.Type == 'toggle' && !this.Enabled) {
		this.Enabled = true;
		if (this.Delay && !this.ID)
			this.ID = setInterval(this.Func, this.Delay);
		else
			this.Func();
		if ((typeof notify !== 'undefined' ? notify : true) && this.ShowNotify)
			Game.Notify(this.NotifyTitle, this.NotifyDescOn, this.Icon);
	}
}
/* Disables the action. */
AutoCookieAction.prototype.Disable = function (notify) {
	if (this.Type == 'toggle' && this.Enabled) {
		this.Enabled = false;
		if (this.Delay && this.ID)
			this.ID = clearInterval(this.ID);
		else
			this.Func();
		if ((typeof notify !== 'undefined' ? notify : true) && this.ShowNotify)
			Game.Notify(this.NotifyTitle, this.NotifyDescOff, this.Icon);
	}
}

/*=====================================================================================
AUTO-COOKIE ACTIONS
=======================================================================================*/

/* The list of actions. */
AutoCookie.Actions = {
	all: new AutoCookieAction('Enable All', null, [22, 7], 'basic', false, 0, AutoCookie.EnabledAll, true,
									'Enabled All', 'All Modes ' + 'Activated'.fontcolor('green')),
	none: new AutoCookieAction('Disable All', null, [22, 7], 'basic', false, 0, AutoCookie.DisableAll, true,
									'Disable All', 'All Modes ' + 'Deactivated'.fontcolor('red')),

	allclick: new AutoCookieAction('Enable All', null, [12, 0], 'basic', false, 0, AutoCookie.EnabledAllClick, true,
									'Enabled All', 'All Click Modes ' + 'Activated'.fontcolor('green')),
	noneclick: new AutoCookieAction('Disable All', null, [12, 0], 'basic', false, 0, AutoCookie.DisableAllClick, true,
									'Disable All', 'All Click Modes ' + 'Deactivated'.fontcolor('red')),

	allbuy: new AutoCookieAction('Enable All', null, [15, 0], 'basic', false, 0, AutoCookie.EnabledAllBuy, true,
									'Enabled All', 'All Buy Modes ' + 'Activated'.fontcolor('green')),
	nonebuy: new AutoCookieAction('Disable All', null, [15, 0], 'basic', false, 0, AutoCookie.DisableAllBuy, true,
									'Disable All', 'All Buy Modes ' + 'Deactivated'.fontcolor('red')),

	checkascendinputs: new AutoCookieAction('Check Ascend Inputs', null, [12, 0], 'toggle', false, 400, AutoCookie.CheckAscendInputs, false),
	checkautoclick: new AutoCookieAction('Check Auto Click', null, [12, 0], 'toggle', false, 400, AutoCookie.CheckAutoClick, false),
	autoclick: new AutoCookieAction('Auto Click', null, [12, 0], 'toggle', false, 4, AutoCookie.AutoClick, true),

	slow: new AutoCookieAction('Slow Click', null, [11, 0], 'toggle', false, 300, AutoCookie.AutoClick, true),
	rapid: new AutoCookieAction('Rapid Click', null, [12, 0], 'toggle', false, 5, AutoCookie.AutoClick, true),

	gold: new AutoCookieAction('Click Golden Cookies', 'Golden Click', [11, 14], 'toggle', false, 1000, AutoCookie.ClickGoldenCookies, true),
	wrath: new AutoCookieAction('Allow Wrath Cookies', 'Allow Wrath', [15, 5], 'toggle', false, 0, function () {}, true),
	gnotify: new AutoCookieAction('Golden Cookie Alert', 'Golden Alert', [8, 0], 'toggle', false, 1000, AutoCookie.GoldenCookieAlert, true),

	wrinkler: new AutoCookieAction('Pop Wrinklers', null, [19, 8], 'toggle', false, 2000, AutoCookie.PopWrinklers, true),
	reindeer: new AutoCookieAction('Click Reindeer', null, [12, 9], 'toggle', false, 2000, AutoCookie.ClickReindeer, true),

	autobuy: new AutoCookieAction('Autobuy', null, [15, 0], 'toggle', false, 50, AutoCookie.Autobuy, false),
	autobuildings: new AutoCookieAction('Autobuy Buildings', null, [15, 0], 'toggle', false, 0, function () {}, true),
	autoupgrades: new AutoCookieAction('Autobuy Upgrades', null, [9, 0], 'toggle', false, 0, function () {}, true),
	autoresearch: new AutoCookieAction('Autobuy Reasearch', null, [11, 9], 'toggle', false, 0, function () {}, true),
	autoseason: new AutoCookieAction('Season Cycle', null, [16, 6], 'toggle', false, 0, function () { }, true),


	autoascend: new AutoCookieAction('Auto Ascend', null, [19, 7], 'toggle', false, 5000, AutoCookie.AutoAscend, true),
	allowdevil: new AutoCookieAction('Allow "devil" Upgrade', null, [7, 11], 'toggle', false, 0, AutoCookie.ToggleAllowDevil, true)
};

/*=====================================================================================
AUTO-COOKIE VARIABLES
=======================================================================================*/

/* The autobuy Calculator. */
AutoCookie.Calc = new Calculator();
/* The season cycle manager. */
AutoCookie.Season = new Seasons();

/* The next item to buy with autobuy. */
AutoCookie.NextItem = new BuyoutItem();
/* The next building to buy with autobuy. */
AutoCookie.NextBuilding = new BuyoutItem();
/* The next upgrade to buy with autobuy. */
AutoCookie.NextUpgrade = new BuyoutItem();

AutoCookie.AutoClickRate = 250;


AutoCookie.AscendMinChips = 20000; // 20,000
AutoCookie.AscendMinMultiplier = 1000;

AutoCookie.AscendMaxChips = 1000000000000; // 1 trillion
AutoCookie.AscendMaxMultiplier = 2;

AutoCookie.ChipsForCookies = 80;

AutoCookie.ManualAscend = true;

AutoCookie.AutoAscendTimer = 0;
AutoCookie.AutoAscendStartTime = 0;

AutoCookie.ChipsForAscend = 0;

AutoCookie.PurchaseDevil = false;

/* The notify sound for golden cookies. Source: http://www.soundjay.com/button/beep-30b.mp3 */
AutoCookie.NotifySound = new Audio("https://gist.github.com/pernatiy/38bc231506b06fd85473/raw/beep-30.mp3");

/*=====================================================================================
LAUNCH AUTO-COOKIE
=======================================================================================*/

// Launch Auto-Cookie
AutoCookie.Init();


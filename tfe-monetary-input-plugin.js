/**
 * Champ "input" monétaire avec saisie et formatage contrôlé selon un masque.
 * 
 * @param options - un objet JavaScript avec les propriétés suivantes: 
 * 			'nbIntegerDigits' = le nombre de chiffres avant la virgule
 * 			'nbFractionDigits' = le nombre de chiffres après la virgule
 * 			'acceptsNegative' = un booleen qui indique si le champ permet ou non
 * 									la saisie de valeurs négatives
 */
(function($) {
	'use strict';
	
	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function(searchString, position) {
			position = position || 0;
			return this.indexOf(searchString, position) === position;
		};
	}
	
	$.fn.monetaryInput = function(options) {
		var intCount = options.nbIntegerDigits, 
			decCount = options.nbFractionDigits, 
			acceptsNegative = options.acceptsNegative, 
			intMask = "", decMask = "", decPad = "";

		// Validation des valeurs dans les |options|
		intCount = (isNaN(intCount) ? 0 : intCount);
		decCount = (isNaN(decCount) ? 0 : decCount);
		acceptsNegative = (typeof (acceptsNegative) === "boolean" ? acceptsNegative : false);

		// Construit le |mask| dynamiquement, en fonction du nombre de
		// chiffres dans les parties entière et décimale.
		for (var i = 0; i < intCount; i++) {
			intMask += "9";
		}
		for (var i = 0; i < decCount; i++) {
			decMask += "9";
			decPad += "0";
		}

		var formatComponent = function(c) {
			c.val(function(i, v) {
				if (v.length == 0) {
					return;
				}
				v = v.replace(".", ",");
				if (v.indexOf(",") < 0) {
					if (decPad.length == 0) {
						return v;
					}
					v += ",";
				}
				if (v.startsWith(",")) {
					v = "0" + v;
				}
				var dec = "," + decPad;
				v += dec.substring(v.length - v.indexOf(","));
				return v;
			});
		};
		
		var maskBehavior = function(val) {
			var mask = (acceptsNegative ? "n" : "");
			if (val.startsWith("0") || val.startsWith("-0")) {
				// Empêche la saisie de plus qu'un zéro entier
				mask += ("0" + (decMask.length > 0 ? "V" : "") + decMask);
			} 
			else if (decMask.length > 0) {
				// Le séparateur de décimales est obligatoire une fois la
				// longueur maximale atteinte pour la partie entière.
				mask += (val.length < intCount) ? (intMask + "v" + decMask) : (intMask + "V" + decMask);
			} 
			else {
				mask += intMask;
			}
			
			return mask;
			
		}, options = {
			translation : {
				'n' : {
					pattern : /-/,
					optional : true
				},
				'v' : {
					pattern : /(\.|,)/,
					optional : true
				},
				'V' : {
					pattern : /(\.|,)/,
					optional : false
				}
			},
			onKeyPress : function(val, e, field, options) {
				field.mask(maskBehavior.apply({}, arguments), options);
			}
		};
		
		return this.each(function() {
			var component = $(this);
			
			// Applique le format à la valeur du champ lors de l'initialisation
			formatComponent(component);
					
			(function() {
				component.mask(maskBehavior, options).blur(function() {
					formatComponent(component);
				});
			})();

		});
	};

})(jQuery);

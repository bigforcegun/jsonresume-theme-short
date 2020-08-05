const fs = require("fs");
const Handlebars = require("handlebars");
const _ = require('underscore');
const i18next = require('i18next');
const handlebarsI18next = require('handlebars-i18next');
const utils = require('jsonresume-themeutils');
const moment = require('moment');
const markdown = require('markdown-it')({
	breaks: true
}).use(require('markdown-it-abbr'));

const lang = process.env.LANGUAGE || 'en';

utils.setConfig({ date_format: 'YYYY.MM' });

i18next.init({
	lng: lang,
	debug: true,
	resources: {
		ru: {
			translation: {
				"key": "hello world",
				"skills_label": "Ключевые навыки",
				"experience_label": "История работы",
				"education_label": "образование",
				"languages_label": "Языки",
				"phone_label": "Телефон",
				"email_label": "Email",
				"present_label": "Настоящее время"
			}
		},
		en: {
			translation: {
				"key": "hello world",
				"skills_label": "Key Skills",
				"experience_label": "Work History",
				"education_label": "Education",
				"languages_label": "Languages",
				"phone_label": "Phone",
				"email_label": "Email",
				"present_label": "Present"
			}
		}
	}
}, function (err, t) {
	i18next.t('key');
});


function render(resume) {
	const css = fs.readFileSync(__dirname + "/style.css", "utf-8");
	const template = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");


	const lastWorkCount = process.env.LAST_WORK || resume.work.length;

	resume.work = resume.work.slice(0,lastWorkCount)
	resume.basics.summary = resume.basics.summary_short || resume.basics.summary

	return Handlebars.compile(template)({
		css: css,
		resume: resume
	});
}

handlebarsI18next.default(Handlebars, i18next, 't');

Handlebars.registerHelper('date', function(date) {
	return utils.getFormattedDate(date);
});

Handlebars.registerHelper('paragraphSplit', function(plaintext) {
    var i, output = '',
        lines = plaintext.split(/\r\n|\r|\n/g);
    for (i = 0; i < lines.length; i++) {
        if(lines[i]) {
            output += '<p>' + lines[i] + '</p>';
        }
    }
    return new Handlebars.SafeString(output);
});

Handlebars.registerHelper('md', function (plaintext) {
	if (plaintext != null) {
		return new Handlebars.SafeString(markdown.render(plaintext)) 
	}
	return new Handlebars.SafeString('') 
});

module.exports = {
	render: render,
	pdfRenderOptions: {
		mediaType: 'print'
	}
};

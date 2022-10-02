const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 5001;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const cors = require('cors');
const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not Allowed Origin!'));
        }
    },
};
app.use(cors(corsOptions));

async function getWeeklyMeal() {
    try {
        return await axios.get(
            'https://www.bufs.ac.kr/bbs/my/ajax.view.skin.php?bo_table=weekly_meal&wr_id=1'
        );
    } catch (error) {
        console.error(error);
    }
}

app.get('/', async (req, res) => {
    const weekly_meal = [];
    getWeeklyMeal() //
        .then((html) => {
            const $ = cheerio.load(html.data);
            const $tableList = $('#bo_v_con').children('table');
            $tableList.each((i, elem) => {
                weekly_meal.push(`<table>${$(elem).html()}</table>`);
            });
            res.json({ weekly_meal: weekly_meal });
        });
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});

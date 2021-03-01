const express =  require('express');
const controller = require('../controller/controller')

const router = express.Router();


router.get('^/api/produkter/(:id([0-9]{6})|test|alle|alle-aktive|alle-aktive-med-nav-avtale|alle-aktive-med-nav-avtale-techdata)?$', controller.produkter);

router.get('^/api/produkter/sider/:id([0-9]{6})?$', controller.produktSider);


module.exports = router;

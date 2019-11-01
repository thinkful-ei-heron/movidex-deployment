const express = require('express');
const listRouter = express.Router();
const logger = require('../logger');
const {cards,lists} = require('../dataStore');
const uuid = require('uuid/v4');


listRouter.get('/', (req,res) => {
    res.json(lists);
  });

listRouter.get('/:id',(req,res)=>{
const { id } = req.params;
const list = lists.find(l => l.id == id);
if(!list){
    logger.error(`List with id ${id} not found`);
    return res.status(404).send('List not found');
}
res.json(list);
});

listRouter.post('/',(req,res)=>{
    const { header, cardIds= [] } = req.body;
    const id = uuid();
    if(!header){
      logger.error('Require a Header');
      return res.status(400).send('Header not found');
    }

if (cardIds.length > 0) {
    let valid = true;
    for(let i = 0; i< cardIds.length;i++){
    const card = cards.find(c => cardIds[i] == c.id);
    if(!card){
        logger.error(`Card with id ${cardIds[i]} not found in cards array.`);
        valid = false;
    }
    }
    if (!valid) {
    return res
        .status(400)
        .send('Invalid data');
    }
}
const list = {
    id,
    header,
    cardIds
};
lists.push(list);
logger.info(`List added with id ${id}.`);
res.status(201)
    .location(`http://localhost:8000/list/${id}`)
    .json({id});
});

listRouter.delete('/:id',(req,res)=>{
const { id } = req.params;

const listIndex = lists.findIndex(li => li.id == id);

if(listIndex === -1){
    logger.error(`List with id ${id} not found.`);
    return res.status(404).send('Not Found');
}
lists.splice(listIndex, 1);

logger.info(`List with id ${id} was never heard from again.`);
res.status(204).end();
});

module.exports = listRouter;
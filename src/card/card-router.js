const express = require('express');
const cardRouter = express.Router();
const logger = require('../logger');
const {cards,lists} = require('../dataStore');
const uuid = require('uuid/v4');


cardRouter.get('/', (req,res) => {
    res.json(cards);
    });

cardRouter.get('/:id', (req,res)=>{
    const { id } = req.params;
    const card = cards.find(c => c.id == id);

    if(!card){
        logger.error(`Card with id ${id} not found`);
        return res.status(404).send('Card Not Found');
    }
    res.json(card);
    } );


cardRouter.post('/',(req,res)=>{
    const { title, content } = req.body;
    const id = uuid();
    
    if( !title ){
        logger.error('Must have title.');
        return res.status(400).send('Title not found');
    }
    if( !content ){
        logger.error('Must have content');
        return res.status(400).send('Content not found');
    }

    const card ={
        id, 
        title,
        content
    };

cards.push(card);
    logger.info(`Card with id ${id} created`);
    res.status(201)
        .location(`http://localhost8000/card/${id}`)
        .json(card);
});

cardRouter.delete('/:id',(req,res)=>{
    const { id } = req.params;
    const cardIndex = cards.findIndex(c => c.id == id);
    
    if(cardIndex === -1){
        logger.error(`Card with id ${id} was not found`);
        return res.status(404).send('Not Found');
    }
    for(let i = 0; i < lists.length; i++){
        const cardIds = lists[i].cardIds.filter(cid => cid !== id);
        lists[i].cardIds = cardIds;
    }
    cards.splice(cardIndex,1);
    logger.info(`Card with id ${id} was never heard from again.`);
    res.status(204).end();
});

module.exports = cardRouter;
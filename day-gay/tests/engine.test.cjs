const {test}=require('node:test');const assert=require('node:assert/strict');const E=require('../engine.js');
function simulate(level,policy,bot=true){const s=E.create(level);for(let i=0;i<1800&&s.winner===null;i++)E.step(s,1/60,policy(s),bot);return s;}
test('Holding or releasing forever loses against normal bot',()=>{for(const held of [true,false])assert.equal(simulate('normal',()=>[held,false]).winner,1);});
test('Tracking the moving target can beat every bot difficulty',()=>{for(const level of Object.keys(E.levels)){const s=simulate(level,s=>[s.players[0].force<s.players[0].target,false]);assert.equal(s.winner,0,level);assert.ok(s.players[0].bursts>0);}});
test('Identical human input ends in a draw when forces match',()=>{const s=simulate('normal',()=>[false,false],false);assert.equal(s.winner,2);assert.equal(s.time,0);});
test('Finished rounds cannot mutate and force remains bounded',()=>{const s=simulate('easy',()=>[true,false]);assert.ok(s.players.every(p=>p.force>=0&&p.force<=1));const frozen=JSON.stringify(s);E.step(s,.05,[false,true]);assert.equal(JSON.stringify(s),frozen);});
test('Perfect zone rewards accuracy more than ordinary zone',()=>{assert.equal(E.quality(.5,.5,.3),1);assert.equal(E.quality(.6,.5,.3),.73);assert.equal(E.quality(.9,.5,.3),.12);});

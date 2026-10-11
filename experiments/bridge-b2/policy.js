'use strict';
const P=require('./protocol');
// An actual authority must supply these allowlists before any transport serialization.
// Desktop controls are never a source of authorization. B1 uses test fixtures only.
function filterSnapshot(snapshot,grant){P.payload('orbat.snapshot',snapshot);if(!grant||!['viewer','planner','gm','admin'].includes(grant.role)||!['units','markers','events'].every(k=>grant[k] instanceof Set))throw Error('Authority grant required');return JSON.parse(JSON.stringify({...snapshot,units:snapshot.units.filter(u=>grant.units.has(u.id)),markers:snapshot.markers.filter(m=>grant.markers.has(m.id)),events:snapshot.events.filter(e=>grant.events.has(e.eventId))}));}
function authorizeCommand(){return false;}
function filterUpdates(updates,grant){P.payload('orbat.delta.batch',{updates});filterSnapshot({terrainId:'everon-simulation',coordinateSpace:'planner-local-meters-simulation',units:[],markers:[],events:[]},grant);return JSON.parse(JSON.stringify(updates.filter(u=>u.kind==='event'?grant.events.has(u.event.eventId):grant[u.target==='unit'?'units':'markers'].has(u.kind==='upsert'?u.entity.id:u.id))));}
module.exports={filterSnapshot,filterUpdates,authorizeCommand};

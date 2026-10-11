'use strict';
class MockTransport{
 open(receive,onClose){this.receive=receive;this.onClose=onClose;this.opened=true;}
 deliver(wire,token){return this.opened?this.receive(wire,token):{status:'disconnected'};}
 interrupt(){const cb=this.onClose;this.close();cb?.();}
 close(){this.opened=false;this.receive=null;this.onClose=null;}
}
module.exports={MockTransport};

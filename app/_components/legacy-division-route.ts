// Preserve shared links from the original homepage tabs before its body paints.
// Fragments do not reach the server, so only these legacy entries need a client redirect.
export const legacyDivisionRouteScript = `(()=>{const p=location.pathname,h=location.hash;let target="";if(p==="/"&&h==="#ersiyan-virtual-view")target="/virtual";else if(p==="/virtual"&&(h==="#ersiyan-games-view"||h==="#games"||h==="#studio"))target="/";if(target){document.documentElement.setAttribute("data-division-redirect","");location.replace(target+location.search+(h==="#games"||h==="#studio"?h:""));}})();`;

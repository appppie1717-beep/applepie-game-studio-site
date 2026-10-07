// Preserve links to the former homepage departments before the new company home paints.
// Fragment destinations cannot be handled by server redirects.
export const legacyDivisionRouteScript = `(()=>{
const p=location.pathname,h=location.hash,q=location.search;
if(p!=="/"&&p!=="/games"&&p!=="/virtual")return;
const parts=q.slice(1).split("&"),choice=parts.find(v=>/^division=(games|virtual|company)$/.test(v));
let target="",search=q,fragment=h;
if(choice){
  const division=choice.slice(9);
  target=division==="games"?"/games":division==="virtual"?"/virtual":"/";
  const rest=parts.filter(v=>!/^division=(games|virtual|company)$/.test(v)).join("&");
  search=rest?"?"+rest:"";
}else if(h==="#ersiyan-virtual-view")target="/virtual";
else if(h==="#ersiyan-games-view"||h==="#games"||h==="#studio")target="/games";
else if(h==="#ersiyan-company-view")target="/";
if(!target)return;
if(!choice&&target===p)return;
if(h==="#ersiyan-games-view"||h==="#ersiyan-virtual-view")fragment="";
if(choice&&((target!=="/games"&&(h==="#games"||h==="#studio"))||(target!=="/"&&h==="#ersiyan-company-view")))fragment="";
const destination=target+search+fragment;
if(destination===p+q+h)return;
document.documentElement.setAttribute("data-division-redirect","");
location.replace(destination);
})();`;

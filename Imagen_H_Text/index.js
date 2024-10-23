var t1 = gsap.timeline({
    paused:"true"
});
t1.to(".menu",{
    duration:1,
    x:"0%",
    ease:Expo.easeInOut
});
t1.fromTo(".li",{
    y:"-100%",
    opacity:0
},{
    duration:1,
    opacity:1,
    y:"0%",
    stagger:0.25
});

t1.fromTo(".social-li",{
    y:"-50%",
    opacity:0
},{
    duration:0.8,
    opacity:1,
    stagger:0.25,
    ease: Expo.easeOut
},
"-=0.5");

function toggle(){
    t1.play()
}
function togglec(){
    t1.reverse()
}
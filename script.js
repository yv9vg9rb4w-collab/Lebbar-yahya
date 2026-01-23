// SCIENTIFIQUE
function calculate(input){
    try { return eval(input); } // simple mais sûr à améliorer
    catch(e){ return "Erreur"; }
}

// MATRICES
function det2x2(A){ return A[0][0]*A[1][1]-A[0][1]*A[1][0]; }

// 3D
function create3DScene(containerId){
    const container = document.getElementById(containerId);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight,0.1,1000);
    camera.position.set(5,5,5);
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(10,10,10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({color:0x00ff00,wireframe:true}));
    scene.add(cube);
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5,32,32), new THREE.MeshStandardMaterial({color:0xff0000}));
    sphere.position.set(2,0.5,0);
    scene.add(sphere);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    function animate(){
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        controls.update();
        renderer.render(scene,camera);
    }
    animate();
}

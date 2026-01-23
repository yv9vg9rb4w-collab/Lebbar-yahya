const SIZE = 12;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(15, 15, 15);

const nodes = [];
const gridGroup = new THREE.Group();
const geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);

// Génération
for(let x=0; x<SIZE; x++) {
    nodes[x] = [];
    for(let y=0; y<SIZE; y++) {
        nodes[x][y] = [];
        for(let z=0; z<SIZE; z++) {
            const wall = Math.random() < 0.25 && (x+y+z > 2);
            const mat = new THREE.MeshPhongMaterial({
                color: wall ? 0x111111 : 0x00ffcc,
                transparent: true,
                opacity: wall ? 0.8 : 0.05
            });
            const cube = new THREE.Mesh(geometry, mat);
            cube.position.set(x, y, z);
            gridGroup.add(cube);
            nodes[x][y][z] = { x, y, z, wall, g: Infinity, f: Infinity, parent: null, mesh: cube };
        }
    }
}
scene.add(gridGroup);
scene.add(new THREE.AmbientLight(0x00ffcc, 0.3));

// Algo A*
function solve() {
    let start = nodes[0][0][0], end = nodes[SIZE-1][SIZE-1][SIZE-1];
    let open = [start]; start.g = 0;

    while(open.length > 0) {
        open.sort((a,b) => a.f - b.f);
        let curr = open.shift();
        if(curr === end) {
            document.getElementById('status').innerText = "PATH_FOUND";
            while(curr) {
                curr.mesh.material.color.set(0xffffff);
                curr.mesh.material.opacity = 1;
                curr = curr.parent;
            }
            return;
        }
        [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].forEach(d => {
            let nx=curr.x+d[0], ny=curr.y+d[1], nz=curr.z+d[2];
            if(nx>=0 && nx<SIZE && ny>=0 && ny<SIZE && nz>=0 && nz<SIZE) {
                let nb = nodes[nx][ny][nz];
                if(!nb.wall && curr.g+1 < nb.g) {
                    nb.parent = curr; nb.g = curr.g+1;
                    nb.f = nb.g + (Math.abs(nx-end.x)+Math.abs(ny-end.y)+Math.abs(nz-end.z));
                    if(!open.includes(nb)) open.push(nb);
                }
            }
        });
    }
}

solve();
function animate() {
    requestAnimationFrame(animate);
    gridGroup.rotation.y += 0.001;
    controls.update();
    renderer.render(scene, camera);
}
animate();

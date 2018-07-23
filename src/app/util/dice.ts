import * as CANNON from 'src/scripts/cannon.min.js'
import * as THREE from 'src/scripts/three.min.js'
import { Subject, Observable } from 'rxjs';


export class Roll {
    expression: string
    values: number[]
    dice: DiceResult[]

    get total(): number {
        let t = 0;
        this.values.forEach(v => { t = t + v })
        return t
    }

    get text(): string {
        let strs = []
        this.dice.forEach(d => {
            strs.push("[" + d.type + "] " + d.value)
        })

        let str = strs.join(" + ")
        str += " = " + this.total
        return str
    }


}

export class DiceResult {
    value: number;
    type: string;
    get class(): string {
        return "df-" + this.type + "-" + this.value
    }
    isCriticalFail(): boolean {
        return this.type == 'd20' && this.value == 1
    }
    isCriticalSuccess(): boolean {
        return this.type == 'd20' && this.value == 20
    }
    isMax(): boolean {
        let max = parseInt(this.type.substr(1))
        return max == this.value
    }
    isMin(): boolean {
        return this.value == 1
    }
}

export class DumbRoller {
    roll(expression: string) {

    }
}

export class Dice {
    static readonly known_types = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
    static readonly dice_face_range = {
        'd4': [1, 4], 'd6': [1, 6], 'd8': [1, 8], 'd10': [0, 9],
        'd12': [1, 12], 'd20': [1, 20], 'd100': [0, 9]
    };
    static readonly dice_mass = { 'd4': 300, 'd6': 300, 'd8': 340, 'd10': 350, 'd12': 350, 'd20': 400, 'd100': 350 };
    static readonly dice_inertia = { 'd4': 5, 'd6': 13, 'd8': 10, 'd10': 9, 'd12': 8, 'd20': 6, 'd100': 9 };

    that: Dice
    random_storage = [];
    use_true_random = true;
    frame_rate = 1 / 60;

    use_adapvite_timestep: boolean
    animate_selector: boolean
    world: any
    scene: any
    camera: any
    dices: any[]
    renderer: any
    dice_body_material: any
    h: number
    w: number
    last_time: any
    running: any
    callback = () => { console.log("CALLBACK") }
    pane: any
    ch: any
    cw: any
    aspect: number
    wh: any
    light: any
    desk: any
    rolling: boolean


    constructor(container, dimentions) {
        this.that = this
        this.use_adapvite_timestep = true;
        this.animate_selector = true;

        this.dices = [];
        this.scene = new THREE.Scene();
        this.world = new CANNON.World();

        this.renderer = window.WebGLRenderingContext
            ? new THREE.WebGLRenderer({ alpha: true, antialias: true })
            : new THREE.CanvasRenderer({ alpha: true, antialias: true });

        // this.renderer = new THREE.CanvasRenderer({ antialias: true })
        container.appendChild(this.renderer.domElement); //#
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        // this.renderer.setClearColor(0xffffff, 0);
        this.renderer.setClearColor(0x000000, 0); // the default

        this.reinit(container, dimentions);

        this.world.gravity.set(0, 0, -9.8 * 800);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 16;

        var ambientLight = new THREE.AmbientLight(this.that.ambient_light_color);
        this.scene.add(ambientLight);

        this.dice_body_material = new CANNON.Material();
        var desk_body_material = new CANNON.Material();
        var barrier_body_material = new CANNON.Material();
        this.world.addContactMaterial(new CANNON.ContactMaterial(
            desk_body_material, this.dice_body_material, 0.01, 0.5));
        this.world.addContactMaterial(new CANNON.ContactMaterial(
            barrier_body_material, this.dice_body_material, 0, 1.0));
        this.world.addContactMaterial(new CANNON.ContactMaterial(
            this.dice_body_material, this.dice_body_material, 0, 0.5));

        this.world.add(new CANNON.RigidBody(0, new CANNON.Plane(), desk_body_material));
        var barrier;
        barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
        barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
        barrier.position.set(0, this.h * 0.93, 0);
        this.world.add(barrier);

        barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
        barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        barrier.position.set(0, -this.h * 0.93, 0);
        this.world.add(barrier);

        barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
        barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
        barrier.position.set(this.w * 0.93, 0, 0);
        this.world.add(barrier);

        barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
        barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
        barrier.position.set(-this.w * 0.93, 0, 0);
        this.world.add(barrier);

        this.last_time = 0;
        this.running = false;

        this.renderer.render(this.scene, this.camera);
    }

    // prepare_rnd(callback) {
    //     // if (!random_storage.length && this.use_true_random) {
    //     //     try {
    //     //         $t.rpc({ method: "random", n: 512 }, 
    //     //         function(random_responce) {
    //     //             if (!random_responce.error)
    //     //                 random_storage = random_responce.result.random.data;
    //     //             else this.use_true_random = false;
    //     //             callback();
    //     //         });
    //     //         return;
    //     //     }
    //     //     catch (e) { this.use_true_random = false; }
    //     // }
    //     callback();
    // }

    rnd() {
        return this.random_storage.length ? this.random_storage.pop() : Math.random();
    }

    create_shape(vertices, faces, radius) {
        console.log("create_shape");

        var cv = new Array(vertices.length), cf = new Array(faces.length);
        for (var i = 0; i < vertices.length; ++i) {
            var v = vertices[i];
            cv[i] = new CANNON.Vec3(v.x * radius, v.y * radius, v.z * radius);
        }
        for (var i = 0; i < faces.length; ++i) {
            cf[i] = faces[i].slice(0, faces[i].length - 1);
        }
        return new CANNON.ConvexPolyhedron(cv, cf);
    }

    make_geom(vertices, faces, radius, tab, af) {
        console.log("make_geom");

        var geom = new THREE.Geometry();
        for (var i = 0; i < vertices.length; ++i) {
            var vertex = vertices[i].multiplyScalar(radius);
            vertex.index = geom.vertices.push(vertex) - 1;
        }
        for (var i = 0; i < faces.length; ++i) {
            var ii = faces[i], fl = ii.length - 1;
            var aa = Math.PI * 2 / fl;
            for (var j = 0; j < fl - 2; ++j) {
                geom.faces.push(new THREE.Face3(ii[0], ii[j + 1], ii[j + 2], [geom.vertices[ii[0]],
                geom.vertices[ii[j + 1]], geom.vertices[ii[j + 2]]], 0, ii[fl] + 1));
                geom.faceVertexUvs[0].push([
                    new THREE.Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
                    new THREE.Vector2((Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)),
                    new THREE.Vector2((Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab))]);
            }
        }
        geom.computeFaceNormals();
        geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
        return geom;
    }

    chamfer_geom(vectors, faces, chamfer) {
        console.log("chamfer_geom");

        var chamfer_vectors = [], chamfer_faces = [], corner_faces = new Array(vectors.length);
        for (var i = 0; i < vectors.length; ++i) corner_faces[i] = [];
        for (var i = 0; i < faces.length; ++i) {
            var ii = faces[i], fl = ii.length - 1;
            var center_point = new THREE.Vector3();
            var face = new Array(fl);
            for (var j = 0; j < fl; ++j) {
                var vv = vectors[ii[j]].clone();
                center_point.add(vv);
                corner_faces[ii[j]].push(face[j] = chamfer_vectors.push(vv) - 1);
            }
            center_point.divideScalar(fl);
            for (var j = 0; j < fl; ++j) {
                var vv = chamfer_vectors[face[j]];
                vv.subVectors(vv, center_point).multiplyScalar(chamfer).addVectors(vv, center_point);
            }
            face.push(ii[fl]);
            chamfer_faces.push(face);
        }
        for (var i = 0; i < faces.length - 1; ++i) {
            for (var j = i + 1; j < faces.length; ++j) {
                var pairs = [], lastm = -1;
                for (var m = 0; m < faces[i].length - 1; ++m) {
                    var n = faces[j].indexOf(faces[i][m]);
                    if (n >= 0 && n < faces[j].length - 1) {
                        if (lastm >= 0 && m != lastm + 1) pairs.unshift([i, m], [j, n]);
                        else pairs.push([i, m], [j, n]);
                        lastm = m;
                    }
                }
                if (pairs.length != 4) continue;
                chamfer_faces.push([chamfer_faces[pairs[0][0]][pairs[0][1]],
                chamfer_faces[pairs[1][0]][pairs[1][1]],
                chamfer_faces[pairs[3][0]][pairs[3][1]],
                chamfer_faces[pairs[2][0]][pairs[2][1]], -1]);
            }
        }
        for (var i = 0; i < corner_faces.length; ++i) {
            var cf = corner_faces[i], face = [cf[0]], count = cf.length - 1;
            while (count) {
                for (var m = <number>faces.length; m < chamfer_faces.length; ++m) {
                    var index = chamfer_faces[m].indexOf(face[face.length - 1]);
                    if (index >= 0 && index < 4) {
                        if (--index == -1) index = 3;
                        var next_vertex = chamfer_faces[m][index];
                        if (cf.indexOf(next_vertex) >= 0) {
                            face.push(next_vertex);
                            break;
                        }
                    }
                }
                --count;
            }
            face.push(-1);
            chamfer_faces.push(face);
        }
        return { vectors: chamfer_vectors, faces: chamfer_faces };
    }

    create_geom(vertices, faces, radius, tab, af, chamfer) {
        console.log("create_geom");

        var vectors = new Array(vertices.length);
        for (var i = 0; i < vertices.length; ++i) {
            vectors[i] = (new THREE.Vector3).fromArray(vertices[i]).normalize();
        }
        var cg = this.chamfer_geom(vectors, faces, chamfer);
        var geom = this.make_geom(cg.vectors, cg.faces, radius, tab, af);
        //var geom = make_geom(vectors, faces, radius, tab, af); // Without chamfer
        geom.cannon_shape = this.create_shape(vectors, faces, radius);
        return geom;
    }

    standart_d20_dice_face_labels = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8',
        '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

    standart_d100_dice_face_labels = [' ', '00', '10', '20', '30', '40', '50',
        '60', '70', '80', '90'];

    calc_texture_size(approx) {
        console.log("calc_texture_size");

        return Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)));
    }

    create_dice_materials = function (face_labels, size, margin) {
        console.log("create_dice_materials");

        let that = this
        function create_text_texture(text, color, back_color) {
            if (text == undefined) return null;
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var ts = that.calc_texture_size(size + size * 2 * margin) * 2;
            canvas.width = canvas.height = ts;
            context.font = ts / (1 + 2 * margin) + "pt Arial";
            context.fillStyle = back_color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = color;
            context.fillText(text, canvas.width / 2, canvas.height / 2);
            if (text == '6' || text == '9') {
                context.fillText('  .', canvas.width / 2, canvas.height / 2);
            }
            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        }
        var materials = [];
        for (var i = 0; i < face_labels.length; ++i)
            materials.push(new THREE.MeshPhongMaterial($t.copyto(this.material_options,
                { map: create_text_texture(face_labels[i], this.label_color, this.dice_color) })));
        return materials;
    }

    create_d4_materials = function (size, margin) {
        console.log("create_d4_materials");

        let that = this
        function create_d4_text(text, color, back_color) {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var ts = that.calc_texture_size(size + margin) * 2;
            canvas.width = canvas.height = ts;
            context.font = (ts - margin) / 1.5 + "pt Arial";
            context.fillStyle = back_color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = color;
            for (var i in text) {
                context.fillText(text[i], canvas.width / 2,
                    canvas.height / 2 - ts * 0.3);
                context.translate(canvas.width / 2, canvas.height / 2);
                context.rotate(Math.PI * 2 / 3);
                context.translate(-canvas.width / 2, -canvas.height / 2);
            }
            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        }
        var materials = [];
        var labels = [[], [0, 0, 0], [2, 4, 3], [1, 3, 4], [2, 1, 4], [1, 2, 3]];
        for (var i = 0; i < labels.length; ++i)
            materials.push(new THREE.MeshPhongMaterial($t.copyto(this.material_options,
                { map: create_d4_text(labels[i], this.label_color, this.dice_color) })));
        return materials;
    }

    create_d4_geometry = function (radius) {
        var vertices = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]];
        var faces = [[1, 0, 2, 1], [0, 1, 3, 2], [0, 3, 2, 3], [1, 2, 3, 4]];
        return this.create_geom(vertices, faces, radius, -0.1, Math.PI * 7 / 6, 0.96);
    }

    create_d6_geometry = function (radius) {
        var vertices = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
        var faces = [[0, 3, 2, 1, 1], [1, 2, 6, 5, 2], [0, 1, 5, 4, 3],
        [3, 7, 6, 2, 4], [0, 4, 7, 3, 5], [4, 5, 6, 7, 6]];
        return this.create_geom(vertices, faces, radius, 0.1, Math.PI / 4, 0.96);
    }

    create_d8_geometry = function (radius) {
        var vertices = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
        var faces = [[0, 2, 4, 1], [0, 4, 3, 2], [0, 3, 5, 3], [0, 5, 2, 4], [1, 3, 4, 5],
        [1, 4, 2, 6], [1, 2, 5, 7], [1, 5, 3, 8]];
        return this.create_geom(vertices, faces, radius, 0, -Math.PI / 4 / 2, 0.965);
    }

    create_d10_geometry = function (radius) {
        var a = Math.PI * 2 / 10, k = Math.cos(a), h = 0.105, v = -1;
        var vertices = [];
        for (var i = 0, b = 0; i < 10; ++i, b += a)
            vertices.push([Math.cos(b), Math.sin(b), h * (i % 2 ? 1 : -1)]);
        vertices.push([0, 0, -1]); vertices.push([0, 0, 1]);
        var faces = [[5, 7, 11, 0], [4, 2, 10, 1], [1, 3, 11, 2], [0, 8, 10, 3], [7, 9, 11, 4],
        [8, 6, 10, 5], [9, 1, 11, 6], [2, 0, 10, 7], [3, 5, 11, 8], [6, 4, 10, 9],
        [1, 0, 2, v], [1, 2, 3, v], [3, 2, 4, v], [3, 4, 5, v], [5, 4, 6, v],
        [5, 6, 7, v], [7, 6, 8, v], [7, 8, 9, v], [9, 8, 0, v], [9, 0, 1, v]];
        return this.create_geom(vertices, faces, radius, 0, Math.PI * 6 / 5, 0.945);
    }

    create_d12_geometry = function (radius) {
        var p = (1 + Math.sqrt(5)) / 2, q = 1 / p;
        var vertices = [[0, q, p], [0, q, -p], [0, -q, p], [0, -q, -p], [p, 0, q],
        [p, 0, -q], [-p, 0, q], [-p, 0, -q], [q, p, 0], [q, -p, 0], [-q, p, 0],
        [-q, -p, 0], [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1],
        [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]];
        var faces = [[2, 14, 4, 12, 0, 1], [15, 9, 11, 19, 3, 2], [16, 10, 17, 7, 6, 3], [6, 7, 19, 11, 18, 4],
        [6, 18, 2, 0, 16, 5], [18, 11, 9, 14, 2, 6], [1, 17, 10, 8, 13, 7], [1, 13, 5, 15, 3, 8],
        [13, 8, 12, 4, 5, 9], [5, 4, 14, 9, 15, 10], [0, 12, 8, 10, 16, 11], [3, 19, 7, 17, 1, 12]];
        return this.create_geom(vertices, faces, radius, 0.2, -Math.PI / 4 / 2, 0.968);
    }

    create_d20_geometry = function (radius) {
        var t = (1 + Math.sqrt(5)) / 2;
        var vertices = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
        [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
        [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
        var faces = [[0, 11, 5, 1], [0, 5, 1, 2], [0, 1, 7, 3], [0, 7, 10, 4], [0, 10, 11, 5],
        [1, 5, 9, 6], [5, 11, 4, 7], [11, 10, 2, 8], [10, 7, 6, 9], [7, 1, 8, 10],
        [3, 9, 4, 11], [3, 4, 2, 12], [3, 2, 6, 13], [3, 6, 8, 14], [3, 8, 9, 15],
        [4, 9, 5, 16], [2, 4, 11, 17], [6, 2, 10, 18], [8, 6, 7, 19], [9, 8, 1, 20]];
        return this.create_geom(vertices, faces, radius, -0.2, -Math.PI / 4 / 2, 0.955);
    }

    material_options = {
        specular: 0x172022,
        color: 0xf0f0f0,
        shininess: 40,
        shading: THREE.FlatShading,
    };
    label_color = '#aaaaaa';
    dice_color = '#202020';
    ambient_light_color = 0xf0f5fb;
    spot_light_color = 0xefdfd5;
    selector_back_colors = { color: 0x404040, shininess: 0, emissive: 0x858787 };
    desk_color = 0xdfdfdf;


    scale = 50;

    create_d4 = function () {
        console.log("create_d4");

        if (!this.d4_geometry) this.d4_geometry = this.create_d4_geometry(this.scale * 1.2);
        if (!this.d4_material) this.d4_material = new THREE.MeshFaceMaterial(
            this.create_d4_materials(this.scale / 2, this.scale * 2));
        return new THREE.Mesh(this.d4_geometry, this.d4_material);
    }

    create_d6 = function () {
        console.log("create_d6");
        if (!this.d6_geometry) this.d6_geometry = this.create_d6_geometry(this.scale * 0.9);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
            this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2, 1.0));
        return new THREE.Mesh(this.d6_geometry, this.dice_material);
    }

    create_d8 = function () {
        if (!this.d8_geometry) this.d8_geometry = this.create_d8_geometry(this.scale);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
            this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2, 1.2));
        return new THREE.Mesh(this.d8_geometry, this.dice_material);
    }

    create_d10 = function () {
        if (!this.d10_geometry) this.d10_geometry = this.create_d10_geometry(this.scale * 0.9);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
            this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2, 1.0));
        return new THREE.Mesh(this.d10_geometry, this.dice_material);
    }

    create_d12 = function () {
        if (!this.d12_geometry) this.d12_geometry = this.create_d12_geometry(this.scale * 0.9);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
            this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2, 1.0));
        return new THREE.Mesh(this.d12_geometry, this.dice_material);
    }

    create_d20 = function () {
        if (!this.d20_geometry) this.d20_geometry = this.create_d20_geometry(this.scale);
        if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
            this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2, 1.0));
        return new THREE.Mesh(this.d20_geometry, this.dice_material);
    }

    create_d100 = function () {
        if (!this.d10_geometry) this.d10_geometry = this.create_d10_geometry(this.scale * 0.9);
        if (!this.d100_material) this.d100_material = new THREE.MeshFaceMaterial(
            this.create_dice_materials(this.standart_d100_dice_face_labels, this.scale / 2, 1.5));
        return new THREE.Mesh(this.d10_geometry, this.d100_material);
    }

    static parse_notation(notation) {
        console.log("parse_notation");

        var no = notation.split('@');
        var dr0 = /\s*(\d*)([a-z]+)(\d+)(\s*\+\s*(\d+)){0,1}\s*(\+|$)/gi;
        var dr1 = /(\b)*(\d+)(\b)*/gi;
        var ret = { set: [], constant: 0, result: [], error: false }, res;
        while (res = dr0.exec(no[0])) {
            var command = res[2];
            if (command != 'd') { ret.error = true; continue; }
            var count = parseInt(res[1]);
            if (res[1] == '') count = 1;
            var type = 'd' + res[3];
            if (this.known_types.indexOf(type) == -1) { ret.error = true; continue; }
            while (count--) ret.set.push(type);
            if (res[5]) ret.constant += parseInt(res[5]);
        }
        while (res = dr1.exec(no[1])) {
            ret.result.push(parseInt(res[2]));
        }
        return ret;
    }

    stringify_notation = function (nn) {
        var dict = {}, notation = '';
        for (var i in nn.set)
            if (!dict[nn.set[i]]) dict[nn.set[i]] = 1; else ++dict[nn.set[i]];
        for (var i in dict) {
            if (notation.length) notation += ' + ';
            notation += (dict[i] > 1 ? dict[i] : '') + i;
        }
        if (nn.constant) notation += ' + ' + nn.constant;
        return notation;
    }



    make_random_vector(vector) {
        console.log("make_random_vector");

        var random_angle = this.rnd() * Math.PI / 5 - Math.PI / 5 / 2;
        var vec = {
            x: vector.x * Math.cos(random_angle) - vector.y * Math.sin(random_angle),
            y: vector.x * Math.sin(random_angle) + vector.y * Math.cos(random_angle)
        };
        if (vec.x == 0) vec.x = 0.01;
        if (vec.y == 0) vec.y = 0.01;
        return vec;
    }


    get_dice_value(dice) {
        console.log("get_dice_value", dice);

        var vector = new THREE.Vector3(0, 0, dice.dice_type == 'd4' ? -1 : 1);
        var closest_face, closest_angle = Math.PI * 2;
        for (var i = 0, l = dice.geometry.faces.length; i < l; ++i) {
            var face = dice.geometry.faces[i];
            if (face.materialIndex == 0) continue;
            var angle = face.normal.clone().applyQuaternion(dice.body.quaternion).angleTo(vector);
            if (angle < closest_angle) {
                closest_angle = angle;
                closest_face = face;
            }
        }
        var matindex = closest_face.materialIndex - 1;
        if (dice.dice_type == 'd100') matindex *= 10;
        return matindex;
    }

    get_dice_values(dices) {
        console.log("get_dice_values", dices);

        var values = [];
        for (var i = 0, l = dices.length; i < l; ++i) {
            values.push(this.get_dice_value(dices[i]));
        }
        return values;
    }


    shift_dice_faces(dice, value, res) {
        console.log("shift_dice_faces", dice, value, res);

        var r = Dice.dice_face_range[dice.dice_type];
        if (!(value >= r[0] && value <= r[1])) return;
        var num = value - res;
        var geom = dice.geometry.clone();
        for (var i = 0, l = geom.faces.length; i < l; ++i) {
            var matindex = geom.faces[i].materialIndex;
            if (matindex == 0) continue;
            matindex += num - 1;
            while (matindex > r[1]) matindex -= r[1];
            while (matindex < r[0]) matindex += r[1];
            geom.faces[i].materialIndex = matindex + 1;
        }
        dice.geometry = geom;
    }



    throw_dices(box: Dice, vector, boost, dist, notation_getter, before_roll, after_roll) {
        console.log("throw_dices");

        var uat = this.use_adapvite_timestep;
        function roll(request_results?: any) {
            console.log("roll");

            if (after_roll) {
                box.clear();
                box.roll(vectors, request_results || notation.result, function (result) {
                    if (after_roll) after_roll.call(box, notation, result);
                    box.rolling = false;
                    this.use_adapvite_timestep = uat;
                });
            }
        }
        vector.x /= dist; vector.y /= dist;
        var notation = notation_getter.call(box);
        if (notation.set.length == 0) return;
        var vectors = box.generate_vectors(notation, vector, boost);
        box.rolling = true;
        // if (before_roll) before_roll.call(box, vectors, notation, roll);
        // else roll();
        roll();
    }

    // this.dice_box.prototype.bind_mouse = function(container, notation_getter, before_roll, after_roll) {
    //     var box = this;
    //     $t.bind(container, ['mousedown', 'touchstart'], function(ev) {
    //         ev.preventDefault();
    //         box.mouse_time = (new Date()).getTime();
    //         box.mouse_start = $t.get_mouse_coords(ev);
    //     });
    //     $t.bind(container, ['mouseup', 'touchend'], function(ev) {
    //         if (box.rolling) return;
    //         if (box.mouse_start == undefined) return;
    //         ev.stopPropagation();
    //         var m = $t.get_mouse_coords(ev);
    //         var vector = { x: m.x - box.mouse_start.x, y: -(m.y - box.mouse_start.y) };
    //         box.mouse_start = undefined;
    //         var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    //         if (dist < Math.sqrt(box.w * box.h * 0.01)) return;
    //         var time_int = (new Date()).getTime() - box.mouse_time;
    //         if (time_int > 2000) time_int = 2000;
    //         var boost = Math.sqrt((2500 - time_int) / 2500) * dist * 2;
    //         prepare_rnd(function() {
    //             throw_dices(box, vector, boost, dist, notation_getter, before_roll, after_roll);
    //         });
    //     });
    // }

    // this.dice_box.prototype.bind_throw = function(button, notation_getter, before_roll, after_roll) {
    //     var box = this;
    //     $t.bind(button, ['mouseup', 'touchend'], function(ev) {
    //         ev.stopPropagation();
    //         box.start_throw(notation_getter, before_roll, after_roll);
    //     });
    // }


    // }

    iteration: number

    emulate_throw() {
        while (!this.check_if_throw_finished()) {
            ++this.iteration;
            this.world.step(this.that.frame_rate);
        }
        return this.get_dice_values(this.dices);
    }

    __animate(threadid) {
        // console.log("animate", threadid);

        var time = (new Date()).getTime();
        var time_diff = (time - this.last_time) / 1000;
        if (time_diff > 3) time_diff = this.that.frame_rate;
        ++this.iteration;
        if (this.use_adapvite_timestep) {
            while (time_diff > this.that.frame_rate * 1.1) {
                this.world.step(this.that.frame_rate);
                time_diff -= this.that.frame_rate;
            }
            this.world.step(time_diff);
        }
        else {
            this.world.step(this.that.frame_rate);
        }
        for (var i in this.scene.children) {
            var interact = this.scene.children[i];
            if (interact.body != undefined) {
                interact.position.copy(interact.body.position);
                interact.quaternion.copy(interact.body.quaternion);
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.last_time = this.last_time ? time : (new Date()).getTime();
        if (this.running == threadid && this.check_if_throw_finished()) {
            this.running = false;
            if (this.callback) this.callback.call(this, this.get_dice_values(this.dices));
        }
        if (this.running == threadid) {
            (function (t, tid, uat) {
                if (!uat && time_diff < this.that.frame_rate) {
                    setTimeout(function () { requestAnimationFrame(function () { t.__animate(tid); }); },
                        (this.that.frame_rate - time_diff) * 1000);
                }
                else requestAnimationFrame(function () { t.__animate(tid); });
            })(this, threadid, this.use_adapvite_timestep);
        }
    }

    clear() {
        console.log("CLEAR");

        this.running = false;
        var dice;
        while (dice = this.dices.pop()) {
            this.scene.remove(dice);
            if (dice.body) this.world.remove(dice.body);
        }
        if (this.pane) this.scene.remove(this.pane);
        this.renderer.render(this.scene, this.camera);
        var box = this;
        setTimeout(function () { box.renderer.render(box.scene, box.camera); }, 100);
    }

    prepare_dices_for_roll(vectors) {
        console.log("PREPARE ROLL");

        this.clear();
        this.iteration = 0;
        for (var i in vectors) {
            this.create_dice(vectors[i].set, vectors[i].pos, vectors[i].velocity,
                vectors[i].angle, vectors[i].axis);
        }
    }

    generate_vectors(notation, vector, boost) {
        console.log("GENERATE VECTORS");

        var vectors = [];
        for (var i in notation.set) {
            var vec = this.make_random_vector(vector);
            var pos = {
                x: this.w * (vec.x > 0 ? -1 : 1) * 0.9,
                y: this.h * (vec.y > 0 ? -1 : 1) * 0.9,
                z: this.rnd() * 200 + 200
            };
            var projector = Math.abs(vec.x / vec.y);
            if (projector > 1.0) pos.y /= projector; else pos.x *= projector;
            var velvec = this.make_random_vector(vector);
            var velocity = { x: velvec.x * boost, y: velvec.y * boost, z: -10 };
            var inertia = Dice.dice_inertia[notation.set[i]];
            var angle = {
                x: -(this.rnd() * vec.y * 5 + inertia * vec.y),
                y: this.rnd() * vec.x * 5 + inertia * vec.x,
                z: 0
            };
            var axis = { x: this.rnd(), y: this.rnd(), z: this.rnd(), a: this.rnd() };
            vectors.push({ set: notation.set[i], pos: pos, velocity: velocity, angle: angle, axis: axis });
        }
        return vectors;
    }

    create_dice(type, pos, velocity, angle, axis) {
        console.log("CREATE DICE");

        var dice = this.that['create_' + type]();
        dice.castShadow = true;
        dice.dice_type = type;
        dice.body = new CANNON.RigidBody(Dice.dice_mass[type],
            dice.geometry.cannon_shape, this.dice_body_material);
        dice.body.position.set(pos.x, pos.y, pos.z);
        dice.body.quaternion.setFromAxisAngle(new CANNON.Vec3(axis.x, axis.y, axis.z), axis.a * Math.PI * 2);
        dice.body.angularVelocity.set(angle.x, angle.y, angle.z);
        dice.body.velocity.set(velocity.x, velocity.y, velocity.z);
        dice.body.linearDamping = 0.1;
        dice.body.angularDamping = 0.1;
        this.scene.add(dice);
        this.dices.push(dice);
        this.world.add(dice.body);
    }

    check_if_throw_finished() {
        // console.log("check_if_throw_finished");

        var res = true;
        var e = 6;
        if (this.iteration < 10 / this.that.frame_rate) {
            for (var i = 0; i < this.dices.length; ++i) {
                var dice = this.dices[i];
                if (dice.dice_stopped === true) continue;
                var a = dice.body.angularVelocity, v = dice.body.velocity;
                if (Math.abs(a.x) < e && Math.abs(a.y) < e && Math.abs(a.z) < e &&
                    Math.abs(v.x) < e && Math.abs(v.y) < e && Math.abs(v.z) < e) {
                    if (dice.dice_stopped) {
                        if (this.iteration - dice.dice_stopped > 3) {
                            dice.dice_stopped = true;
                            continue;
                        }
                    }
                    else dice.dice_stopped = this.iteration;
                    res = false;
                }
                else {
                    dice.dice_stopped = undefined;
                    res = false;
                }
            }
        }
        return res;
    }



    reinit(container, dimentions) {
        console.log("reinit");

        this.cw = container.clientWidth / 2;
        this.ch = container.clientHeight / 2;
        if (dimentions) {
            this.w = dimentions.w;
            this.h = dimentions.h;
        }
        else {
            this.w = this.cw;
            this.h = this.ch;
        }
        console.log("WIDTH / HEIGHT", this.w, " ", this.h);


        this.aspect = Math.min(this.cw / this.w, this.ch / this.h);
        this.that.scale = Math.sqrt(this.w * this.w + this.h * this.h) / 13;

        this.renderer.setSize(this.cw * 2, this.ch * 2);
        console.log("Size : ", this.cw * 2, " ", this.ch * 2);


        this.wh = this.ch / this.aspect / Math.tan(10 * Math.PI / 180);
        if (this.camera) this.scene.remove(this.camera);
        this.camera = new THREE.PerspectiveCamera(20, this.cw / this.ch, 1, this.wh * 1.3);
        this.camera.position.z = this.wh;

        var mw = Math.max(this.w, this.h);
        if (this.light) this.scene.remove(this.light);
        this.light = new THREE.SpotLight(this.that.spot_light_color, 2.0);
        this.light.position.set(-mw / 2, mw / 2, mw * 2);
        this.light.target.position.set(0, 0, 0);
        this.light.distance = mw * 5;
        this.light.castShadow = true;
        this.light.shadowCameraNear = mw / 10;
        this.light.shadowCameraFar = mw * 5;
        this.light.shadowCameraFov = 50;
        this.light.shadowBias = 0.001;
        this.light.shadowDarkness = 1.1;
        this.light.shadowMapWidth = 1024;
        this.light.shadowMapHeight = 1024;
        this.scene.add(this.light);

        // if (this.desk) this.scene.remove(this.desk);
        // this.desk = new THREE.Mesh(new THREE.PlaneGeometry(this.w * 2, this.h * 2, 1, 1),
        //     new THREE.MeshPhongMaterial({ color: this.that.desk_color }));
        // this.desk.receiveShadow = true;
        // this.scene.add(this.desk);

        this.renderer.render(this.scene, this.camera);
    }

    start_throw(notation_getter, before_roll, after_roll) {
        console.log("START 1");

        var box = this;
        if (box.rolling) return;
        // this.prepare_rnd(function () {
        var vector = { x: (this.rnd() * 2 - 1) * box.w, y: -(this.rnd() * 2 - 1) * box.h };

        var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        var boost = (this.rnd() + 3) * dist;
        this.throw_dices(box, vector, boost, dist, notation_getter, before_roll, after_roll);
        // });
    }

    roll(vectors, values, callback) {
        console.log("ROLL MAIN");

        this.prepare_dices_for_roll(vectors);
        if (values != undefined && values.length) {
            this.use_adapvite_timestep = false;
            var res = this.emulate_throw();
            this.prepare_dices_for_roll(vectors);
            for (var i in res)
                this.shift_dice_faces(this.dices[i], values[i], res[i]);
        }
        this.callback = callback;
        this.running = (new Date()).getTime();
        this.last_time = 0;
        this.__animate(this.running);
    }

    __selector_animate(threadid) {
        console.log("__selector_animate");

        var time = (new Date()).getTime();
        var time_diff = (time - this.last_time) / 1000;
        if (time_diff > 3) time_diff = this.that.frame_rate;
        var angle_change = 0.3 * time_diff * Math.PI * Math.min(24000 + threadid - time, 6000) / 6000;
        if (angle_change < 0) this.running = false;
        for (var i in this.dices) {
            this.dices[i].rotation.y += angle_change;
            this.dices[i].rotation.x += angle_change / 4;
            this.dices[i].rotation.z += angle_change / 10;
        }
        this.last_time = time;
        this.renderer.render(this.scene, this.camera);
        if (this.running == threadid) {
            (function (t, tid) {
                requestAnimationFrame(function () { t.__selector_animate(tid); });
            })(this, threadid);
        }
    }

    search_dice_by_mouse(ev) {
        console.log("search_dice_by_mouse");

        var m = $t.get_mouse_coords(ev);
        var intersects = (new THREE.Raycaster(this.camera.position,
            (new THREE.Vector3((m.x - this.cw) / this.aspect,
                (m.y - this.ch) / this.aspect, this.w / 9))
                .sub(this.camera.position).normalize())).intersectObjects(this.dices);
        if (intersects.length) return intersects[0].object.userData;
    }

    draw_selector() {
        console.log("draw_selector");

        this.clear();
        var step = this.w / 4.5;
        this.pane = new THREE.Mesh(new THREE.PlaneGeometry(this.w * 6, this.h * 6, 1, 1),
            new THREE.MeshPhongMaterial(this.that.selector_back_colors));
        this.pane.receiveShadow = true;
        this.pane.position.set(0, 0, 1);
        this.scene.add(this.pane);

        var mouse_captured = false;

        for (var i = 0, pos = -3; i < Dice.known_types.length; ++i, ++pos) {
            var dice = $t.dice['create_' + Dice.known_types[i]]();
            dice.position.set(pos * step, 0, step * 0.5);
            dice.castShadow = true;
            dice.userData = Dice.known_types[i];
            this.dices.push(dice); this.scene.add(dice);
        }

        this.running = (new Date()).getTime();
        this.last_time = 0;
        if (this.animate_selector) this.__selector_animate(this.running);
        else this.renderer.render(this.scene, this.camera);
    }


}

export class $t {
    static dice: any = {}

    static copyto(obj, res) {
        if (obj == null || typeof obj !== 'object') return obj;
        if (obj instanceof Array) {
            for (var i = obj.length - 1; i >= 0; --i)
                res[i] = $t.copy(obj[i]);
        }
        else {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    res[prop] = $t.copy(obj[prop]);
            }
        }
        return res;
    }

    static copy = function (obj) {
        if (!obj) return obj;
        return $t.copyto(obj, new obj.constructor());
    }

    static element = function (name, props, place) {
        console.log("element");

        var dom = document.createElement(name);
        if (props) for (var i in props) dom.setAttribute(i, props[i]);
        if (place) place.appendChild(dom);
        return dom;
    }

    static inner = function (obj, sel) {
        console.log("inner");

        sel.appendChild(typeof obj == 'string' ? document.createTextNode(obj) : obj);
    }

    static id = function (id) {
        console.log("id");

        return document.getElementById(id);
    }

    static set = function (sel, props) {
        console.log("set");

        for (var i in props) sel.setAttribute(i, props[i]);
        return sel;
    }

    static clas = function (sel, oldclass, newclass) {
        console.log("cls");

        var oc = oldclass ? oldclass.split(/\s+/) : [],
            nc = newclass ? newclass.split(/\s+/) : [],
            classes = (sel.getAttribute('class') || '').split(/\s+/);
        if (!classes[0]) classes = [];
        for (var i in oc) {
            var ind = classes.indexOf(oc[i]);
            if (ind >= 0) classes.splice(ind, 1);
        }
        for (var i in nc) {
            if (nc[i] && classes.indexOf(nc[i]) < 0) classes.push(nc[i]);
        }
        sel.setAttribute('class', classes.join(' '));
    }

    static empty = function (sel) {
        console.log("empty");

        if (sel.childNodes)
            while (sel.childNodes.length)
                sel.removeChild(sel.firstChild);
    }

    static remove = function (sel) {
        console.log("remove");

        if (sel) {
            if (sel.parentNode) sel.parentNode.removeChild(sel);
            else for (var i = sel.length - 1; i >= 0; --i)
                sel[i].parentNode.removeChild(sel[i]);
        }
    }

    static bind = function (sel, eventname, func, bubble) {
        console.log("bind");

        if (eventname.constructor === Array) {
            for (var i in eventname)
                sel.addEventListener(eventname[i], func, bubble ? bubble : false);
        }
        else
            sel.addEventListener(eventname, func, bubble ? bubble : false);
    }

    static unbind = function (sel, eventname, func, bubble) {
        console.log("unbind");

        if (eventname.constructor === Array) {
            for (var i in eventname)
                sel.removeEventListener(eventname[i], func, bubble ? bubble : false);
        }
        else
            sel.removeEventListener(eventname, func, bubble ? bubble : false);
    }

    static one = function (sel, eventname, func, bubble) {
        console.log("one");

        var one_func = function (e) {
            func.call(this, e);
            $t.unbind(sel, eventname, one_func, bubble);
        };
        $t.bind(sel, eventname, one_func, bubble);
    }

    static raise_event = function (sel, eventname, bubble, cancelable) {
        console.log("raise");

        var evt = document.createEvent('UIEvents');
        evt.initEvent(eventname, bubble == undefined ? true : bubble,
            cancelable == undefined ? true : cancelable);
        sel.dispatchEvent(evt);
    }

    // if (!document.getElementsByClassName) {
    //     teal.get_elements_by_class = function(classes, node) {
    //         var node = node || document,
    //             list = node.getElementsByTagName('*'),
    //             cl = classes.split(/\s+/),
    //             result = [];

    //         for (var i = list.length - 1; i >= 0; --i) {
    //             for (var j = cl.length - 1; j >= 0; --j) {
    //                 var clas = list[i].getAttribute('class');
    //                 if (clas && clas.search('\\b' + cl[j] + '\\b') != -1) {
    //                     result.push(list[i]);
    //                     break;
    //                 }
    //             }
    //         }
    //         return result;
    //     }
    // }
    // else {
    //     teal.get_elements_by_class = function(classes, node) {
    //         return (node || document).getElementsByClassName(classes);
    //     }
    // }

    static rpc = function (params, callback) {
        var ajax = new XMLHttpRequest(), ret;
        ajax.open("post", 'f', true);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4)
                callback.call(ajax, JSON.parse(ajax.responseText));
        };
        ajax.send(JSON.stringify(params));
    }

    static uuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static get_url_params = function () {
        var params = window.location.search.substring(1).split("&");
        var res = {};
        for (var i in params) {
            var keyvalue = params[i].split("=");
            res[keyvalue[0]] = decodeURI(keyvalue[1]);
        }
        return res;
    }

    static get_mouse_coords = function (ev) {
        var touches = ev.changedTouches;
        if (touches) return { x: touches[0].clientX, y: touches[0].clientY };
        return { x: ev.clientX, y: ev.clientY };
    }
}


export class DiceRoller {
    threeDEngine: Dice
    zeroDEngine: DumbRoller

    constructor(private use3d: boolean, private container: HTMLElement, private dimensions?: any) {
    }

    initialize() {
        if (this.use3d && this.threeDEngine == undefined) {
            this.threeDEngine = new Dice(this.container, this.dimensions)
        } else if (!this.zeroDEngine) {
            this.zeroDEngine = new DumbRoller()
        }
    }

    rollDice(expression: string): Observable<Roll> {
        let returnval = new Subject<Roll>()

        let a = Dice.parse_notation(expression)
        console.log("EXPRESSION,", expression, a);

        let r = new Roll()
        r.dice = []
        r.expression = expression
        a.set.forEach(type => {
            let d = new DiceResult()
            d.type = type
            r.dice.push(d)
        })

        this.initialize()
        if (this.use3d) {
            this.threeDEngine.start_throw(() => Dice.parse_notation(expression), () => { }, (_, result) => {
                r.values = result
                r.values.forEach((value, i) => {
                    r.dice[i].value = value
                })
                returnval.next(r)
            })
        } else {
            this.zeroDEngine.roll(expression)
        }

        return returnval;
    }



}

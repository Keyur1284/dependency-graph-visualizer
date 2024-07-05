export default class NodeIDGenerator {
    static ID = 0;

    static getNextID() {
        return NodeIDGenerator.ID++;
    }
}
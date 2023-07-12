export default class Uid{
    private static starter:number = 0;

    static getId():string{
        return `uid-${Uid.starter++}`;
    }

    static currentId():string{
        return `uid-${Uid.starter-1}`;
    }
}
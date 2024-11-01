import type { App, Plugin } from "vue";
import { each } from "lodash-es";

//定义泛型，将传入类型T和Plugin结合，使这个类型对象既有T的特性，也有Plugin的install方法
//这样的话，传入的组件对象就有了install方法，方便将普通组件转换为可安装的插件

type SFCWithInstall<T> = T & Plugin;

//定义一个函数，接收一个组件数组作为参数，返回一个函数，这个函数接收一个App对象作为参数，将传入的组件数组中的每个组件都注册到App对象中
export function makeInstaller(components: Plugin[]) {
  const install = (app: App) =>
    each(components, (c) => {
      app.use(c);//将该插件注册到app实例中
    });

  return install;//返回install函数，在外部使用时可以直接调用这个函数来注册插件
}
//接受一个类型参数T和一个符合类型T的对象component作为参数，返回一个符合类型SFCWithInstall<T>的对象
export const withInstall = <T>(component: T) => {
    //将传入的对象component转换为SFCWithInstall<T>类型，添加install方法尝试获取对组件名称name
  (component as SFCWithInstall<T>).install = (app: App) => {
    const name = (component as any)?.name || "UnnamedComponent";
    //通过app.component方法将组件注册到Vue应用中，使用组件名称name作为组件的名称
    app.component(name, component as SFCWithInstall<T>);
  };
  //返回处理后的component对象，该对象具有install方法，可以方便地将组件注册到Vue应用中
  return component as SFCWithInstall<T>;
};
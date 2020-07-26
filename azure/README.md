Azure上で動かすためのやつ

### Note

* `func extensions install` を実行し、 bin/extensions.dll ローカルに置いておけるようにする
* `pushd .. && yarn run prod:azure && popd`, func command...
* .env.template を参考に環境変数の設定を行う
* Windows でしか現時点 Durable Functions を Azure のサブスクリプションなして動かせないので、local での開発方法は載せていない

# ワンコインコンサル：面談前の3本の動画

すみっちの面談前動画を1つのURLで案内する、GitHub Pages用の静的ページです。
現在は動画URL未設定のため、3本とも「公開準備中」と表示します。

視聴ページ： https://smitch-ai-works.github.io/onecoin-consult-videos/

リポジトリ： https://github.com/smitch-ai-works/onecoin-consult-videos

## 動画を入れる

`videos.json` の3つの `url` に、それぞれLoomの共有URLを入れて `main` にpushしてください。
共有URL（`https://www.loom.com/share/動画ID`）を自動で埋め込みURLに変換します。
Loom側は視聴者がアクセスできる共有設定にしてください。
変更後も視聴ページのURLは同じです。

`title` は見出しです。変更するとページの目次と見出しが一緒に変わります。
動画は①→②→③の順です。再生・視聴完了の計測やLINEへの自動通知はありません。

## 公開

GitHub Pagesの公開元は `main` ブランチの `/` です。ビルドや依存パッケージのインストールは不要です。
公開ページとリポジトリは第三者から閲覧できます。Zoomの参加情報、個人情報、認証情報を追加しないでください。
検索除外を指定していますが、ログインによる閲覧制限はありません。

## ローカル確認

このフォルダをHTTPサーバーで公開してブラウザで開いてください（JSON読み込みのため `file://` での表示は対象外です）。
`node --test test/*.test.js` でURL検証と3本の設定を確認できます。

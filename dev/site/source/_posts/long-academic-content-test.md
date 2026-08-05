---
title: Long Academic Content Test - Data Science Study Guide
tags: "test"
categories: "testing"
excerpt: "Test file for long academic content - comprehensive data science study guide with math formulas and structured content."
mathjax: true
---

## 数据准备与数据分析（$10$分）

### 数据科学基本概念与流程

数据准备

数据分析

数据解读

数据科学的迭代工作流

- 数据获取与探查
- 数据抽取与清洗
- 数据集成与表示
- 数据分析与建模
- 数据展示与解读

### 数据预处理：数据缺失值处理、异常值检测、数据规范化

#### 缺失值处理

- 忽略：保留全的记录和属性
- 用一个全局值代替，例如-1，unknown
- 使用对应属性的平均值
- 使用相同类标签样本对应属性上的平均值
- 用最大可能的值推理
  - 如找最相似的点推理缺失值
  - 使用贝叶斯或决策树推理

猜的越多，离真实数据越远

#### 发现异常值

##### 单变量

统计方法：k倍标准差之外(k=2,3)

均值Mean对异常值很敏感，使用中位数Median

##### 多变量

基于距离———不合群的点，低密度区域

#### 数据归一化(normalization)处理

##### Min-max归一化

$$
v'=\frac{v-\min_v}{\max_v-\min_v}(new\_max_v-new\_min_v)+new\_min_v
$$



##### Z-score归一化

$$
v'=\frac{v-\bar{v}}{\sigma_v}
$$

$\sigma_v$：标准差（根号）

##### 十位数归一化

$$
v'=\frac{v}{10^j}
$$

$j$取值刚好让最大的数$\leq1$

### 数据探索EDA

结构化数据

## 机器学习（$40$分）

### 基础、一些基本概念

监督学习

- 提出问题（Question）

- 准备数据（Input data）

- 选择特征（Features）

- 标注数据（Labels）
- 学习算法（Algorithm）

- 评价模型（Evaluation）

### 评价：准确率、召回率、F值

TP：正确识别

FP：错误识别

TN：正确拒绝

FN：错误拒绝

准确率：$\frac{TP}{TP+FP}$，所有预测成正例的当中，真正是正例的的占比

召回率：$\frac{TP}{TP+FN}$，所有真正是正例的当中，预测成正例的的占比

F值：$\frac{2\times准确率\times召回率}{准确率+召回率}$

### 线性回归（包含设计矩阵、解析解、梯度下降等）

均方误差MSE：$\hat{\theta}$取平均数			

平均绝对误差MAE：$\hat{\theta}$取中位数

SLR：简单的线性回归，$\hat{y_i}=a+bx_i$

MLR：多元线性回归，$\hat{y}=\theta^Tx$

RMSE：$\sqrt{MSE}$

#### 解析解

SLR：$\hat{b}=\frac{\sum(x_i-\bar{x})(y_i-\bar{y})}{\sum(x_i-\bar{x})^2}$，$\hat{a}=\bar{y}-\hat{b}\bar{x}$

MLR：$\hat{\theta}=(X^TX)^{-1}X^TY$，$X$左边要有一列$1$

#### 设计矩阵

MLR：$\hat{Y}=X\theta$

$X$：每一行代表一个实例，每一列代表一个特征（可能有一列1，乘常数使用）

$\theta$：$X$的列数个参数，$\theta_j\times x_{ij}$

$\hat{Y}$：$X$的行数个预测结果，$\hat{y_i}=\sum\theta_j\times x_{ij}$

#### 梯度下降

$x^{(t+1)}=x^{(t)}-\alpha\frac{d}{dx}f(x)$

$\alpha$：学习率

$\alpha\frac{d}{dx}f(x)$的次数尽量小

求解梯度函数：分别对每个参数求解偏导操作

#### 正则化

在原有损失函数的基础上，加入针对$\theta$的惩罚项

L2：$\frac{\lambda}{2}\sum{\theta _j}^2$

L1：$\frac{\lambda}{2}\sum|\theta_j|$

### 决策树分类器（包含信息熵、条件熵、信息增益、决策树构建等）

#### 信息熵

$H(X)=\sum p(x_c)h(x_c)=\sum p(x_c)\log_2\frac{1}{p(x_c)}$

熵越高，表述数据越难预测

熵越高，表示信息量越多

均匀分布($p(x)=\frac{1}{|C|}$)时，熵最大，$H(X)=\log_2|C|$

确定分布时，熵最小，$H(x)=0$

#### 条件熵

$H(X|Y) = E_{x,y}[h(x|y)]=\sum_{x\in X}\sum_{y\in Y}p(x,y)\log_2\frac{1}{p(x|y)}$

给定随机变量X和Y的联合概率分布，假设Y是已知的，我们能从X中获得多少信息量

#### 联合熵

$H(X,A)=\sum_c\sum_aP(c,a)\frac{1}{\log_2P(c,a)}$

#### 信息增益

信息增益：给定随机变量A后，X所减少的不确定性

$IG(X|A)=H(X)−H(X│A)=H(X)−\sum_jP(A=a_j)H(X|A=a_j)=H(X)−\sum_j\sum_iP(A=a_j)H(X=x_i|A=a_j)$

#### 决策树构建

- 贪心策略
  - 从根节点开始扩张，已建立的树不再改变
  - 数据划分后不再改变
  - 每次选择局部**信息增益最大**的特征划分数据
  - 局部最优解

- 递归算法
  - 每一个决策节点用相同的策略扩张

- 还可以使用GINI系数
  - $Gini(X)=1-\sum p(x_c)^2$
  - 特征A将数据集D划分为D1和D2，$Gini_{(D,A)}=\frac{|D_1|}{|D|}Gini(D_1)+\frac{|D_2|}{|D|}Gini(D_2)$

#### 过拟合

- 过拟合：机器学习算法拟合噪声数据，而不是数据中的有意义规律

- 产生的现象：在训练数据上得到的精度远大于在测试数据上得到的精度

- 原因
  - 训练数据量不够、模型过于复杂、模型参数过多
  - 决策树：太深、节点太多。有些节点是在噪声和离群数据的干扰下建立

- 解决方案
  - 降低模型复杂度
  - 决策树：减少节点数目，剪枝

### 线性分类器（感知机、逻辑回归等）

#### 感知机

$f(x;w,b)=sgn(<w,x>+b)$

如果$y_if(x_i)<0$

- $w^{t+1}=w^t+\eta y_ix_i$

- $b^{t+1}=b^t+\eta Ry_i$

- $\eta$：学习步长

- $R$：$\max|x_i|$

#### 逻辑回归

在线性回归输出的结果上加一个非线性函数$\sigma (t)=\frac{1}{1+e^{-t}}$

$f_\theta(x)=\sigma(\theta·x)$

$z_i=f_\theta(X_i)$

$L(\theta,X,y)=-\frac{1}{n}\sum_{i=1}^n[y_i\log z_i+(1-y_i)\log(1-z_i)]$

#### 支持向量机SVM

最大化最小边距（垂直距离）

$\max_w\min_i\frac{1}{||w||}y_i·<w,x_i>$

放缩后$\max_w\frac{1}{||w||}$，$\min_w\frac{1}{2}w^Tw$

### 聚类K-Means

无监督学习

将数据点划分到$k$个簇中，目标是最小化类内距，以及最大化类间距

每次迭代

- 固定中心点（初次随机选择），优化划分（分配到距离最近的蔟中心）
- 固定划分，优化中心点（更新为当前蔟内所有点的平均值）
- 终止：数据不再或很少被重新分配到不同的蔟，中心位置不再发生变化或变化很小

可能会陷入局部最优，对离群点敏感

K-Means是EM（期望最大化）算法的特殊情况

聚类评价

- 熵(entropy)

  - $H(D)=\sum\frac{|D_i|}{|D|}Pr(c_j)\frac{1}{\log_2Pr(c_j)}$

  - $H_{total}(D)=\sum\frac{|D_i|}{|D|}H(D_i)$

- 纯度(purity)

  - $purity(D_i)=\max_jPr(c_j)$
  - $purity_{total}(D)=\sum\frac{|D_i|}{|D|}purity(D_i)$

### GMM/EM算法

每个类簇$Cj$可以表示为一个高斯分布$N(\mu_j,\sigma_j)$

针对每个数据点$x_i$和每个类簇$C_j$，计算条件概率$P(C_j|x_i)$

使用它作为权重，更新新的参数：每个类簇的均值、方差与权重

## 文本数据分析（$20$分）

### 文本的预处理

分词

### 文本的独热表达和分布式表达

#### 独热表达one-hot

单词t的使用频率：Document Frequency(DF)

给定一个含有N个文档的集合D，统计这个单词被采用文档的个数DF(t)

单词的重要性计算：Inverse Document Frequency(IDF)

$IDF(t)=\log_{10}\frac{N}{DF(t)}$，词频低的重要性高

二者结合：tf-idf(t,d)=tf(t,d)\timesIDF(t)



每一个文档表示成一个N维向量，每一维对应一个单词

如果该单词出现在文档中，设置为这个词在文档中的出现的tf-idf值（实数值向量）

如果对应的单词未出现在文档中，设置为0

#### 分布式表达

将单词（本文）表达为低维、稠密的向量

每一个维度不再具有显式的意义

单词表达为隐空间(latent space)中的一个向量

#### LSI

单词-文档共现矩阵：用词频或者TF-IDF

SVD分解：$D=U\Sigma V^T$

$\Sigma$：对角矩阵，是$D$的特征根（从大到小排列）

$U$：左特征向量（每一行对应一个单词）

$V^T$：右特征向量（每一列对应一个文档）

只保留前$K$个特征值，得到低秩近似

### 文本分类

机器学习

- 朴素贝叶斯
- SVM支持向量积
- KNN
- 决策树
- 随机森林

## 图数据分析（$30$分）

### 基础知识

### Centrality（degree、closeness、betweenness中心度）

#### degree Centrality

$$
C_D(v)=\frac{\deg(v)}{n-1}
$$

微博大V

#### closeness Centrality

$$
C_D(v)=\frac{n-1}{\sum_{u\in V-\{v\}}d(u,v)},d(u,v)为u到v的最短距离
$$

中心地标建筑

#### betweenness Centrality

$$
C_C(v)=(\sum_{s,t\in V-\{v\}}\frac{\sigma(s,t|v)}{\sigma(s,t)})/(\frac{(n-1)(n-2)}{2}),
\\\sigma(s,t)为s到t的最短路径个数,
\\\sigma(s,t|v)为s到t经过v的最短路径个数
$$

贸易枢纽

### PageRank的计算

在degree Centrality的基础上，考虑有向图

PageRank的基本思想：

- 给不同的入边赋上不同的权重

- 考虑某个节点v
  - 指向v的节点的PageRank值越高，相应入边的权重越高
  - 指向v的节点指向其它节点的数目越多，对v相应入边的权重越低

$p_i=\sum_{j\rightarrow i}\frac{p_j}{m_j}$

$p_j$指向v的节点的PageRank，$m_j$指向v的节点指向的节点数目

**矩阵形式**：

$p=(p_1,p_2,…,p_n)$，$A$为邻接矩阵

$M$是$n\times n$的矩阵，其中$M[i][i]$表示节点$i$的出度，其余置0

迭代：$p^{t+1}=p^{t}(M^{-1}A)$

直到：$p^{t+1}==p^{t}(M^{-1}A)$

PageRank的结果与p的初值无关

**真正的PageRank算法**

$p_i=\frac{1-\alpha}{n}+\alpha\sum_{j\rightarrow i}\frac{p_j}{m_j}$

**Personalized PageRank**

$p_i=(1-\alpha)p_i^{(0)}+\alpha\sum_{j\rightarrow i}\frac{p_j}{m_j}$

Personalized PageRank与p的初值有关

### 社区检测（模块度计算，louvain算法）

#### 模块度

Modularity Q：$Q(G,S)=\sum_{s\in S}[\frac{\sum_{in}}{m}-(\frac{\sum_{tot}}{2m})^2]$

$\sum_{in}$：社区内的边的权重之和

$\sum_{tot}$：与社区内的节点相连的边的权重之和（社区内所有点的度数之和，即社区内的边要算两次）

$m$：图中的总边数

#### louvain算法

将每个顶点归到最好的类簇中，直到所有的顶点所属的类簇不再变化为止

- 计算将节点$i$合并到邻居$j$所在社区的modularity增益$\Delta Q$

- 将节点$i$合并到能够产生最大增益$\Delta Q$的节点$j$的社区中

- 循环执行上述步骤，直到合并操作不再产生modularity的增益

把一个类簇中的所有顶点聚集抽象为一个超级顶点，重建一个网络，其中的每个顶点对应一个社区

### 影响力（传播模型、Degree Discount算法）

#### IC模型

- 图上的节点有两个状态
  - Active: 成功地被影响到
  - Inactive: 当前还未被影响到

- 选择种子（初始传播者）去激活它的邻居，被激活的邻居继续影响他们的好友
- $u,v$之间有一个影响概率。概率值越大，$v$相信$u$传播消息的可能性就越大

#### 影响力最大化

选择最优种子集合$S^∗$，使得其期望的影响范围最大化

##### 基于节点度的算法——Degree Discount

出度越高的点，影响力越大

选择的种子节点的影响范围避免重叠

$\Delta\sigma(S)=(1-邻居中Active节点的概率和)\times(1+邻居中Inactive的概率和)$

- 选择剩余节点（$V-S$）中度数（$dd_v$）最高的$u$加入$S$
- 对于$V-S$中所有$u$的邻居$v$，根据影响概率计算$v$的度数
  - 每条边的影响概率都是$p$
  - $d_v$表示节点的度数，也是邻居的个数
  - $t_v$表示$v$的邻居中进入种子集合的个数
  - $dd_v$为折扣后的度数，初始为$d_v$
  - $t_v=t_v+1$（$u$进入$S$了）
  - $dd_v=d_v-2t_v-(d_v-t_v)t_vp$
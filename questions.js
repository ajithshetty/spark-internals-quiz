
/**
 * Spark Internals Quiz — question bank
 * ------------------------------------
 * To add more questions, push additional objects to QUIZ_QUESTIONS below.
 * No other code needs to change — the app reads its length dynamically.
 *
 * Schema:
 * {
 *   id:          number   — unique, stable identifier (don't reuse/reorder existing ids)
 *   category:    string   — groups questions in the category filter
 *   difficulty:  "easy" | "medium" | "hard"
 *   question:    string
 *   options:     string[4] — exactly four choices
 *   answer:      number   — index (0-3) of the correct option
 *   explanation: string   — shown after the user answers, right or wrong
 *   reference:   { label: string, url: string } — reading material for this question (optional but recommended)
 * }
 */

const REF = {
  cluster: { label: "Spark Docs · Cluster Mode Overview", url: "https://spark.apache.org/docs/latest/cluster-overview.html" },
  config: { label: "Spark Docs · Configuration", url: "https://spark.apache.org/docs/latest/configuration.html" },
  rdd: { label: "Spark Docs · RDD Programming Guide", url: "https://spark.apache.org/docs/latest/rdd-programming-guide.html" },
  tuning: { label: "Spark Docs · Tuning Guide", url: "https://spark.apache.org/docs/latest/tuning.html" },
  jobSched: { label: "Spark Docs · Job Scheduling", url: "https://spark.apache.org/docs/latest/job-scheduling.html" },
  dagInternals: { label: "The Internals of Spark Core · DAGScheduler", url: "https://books.japila.pl/apache-spark-internals/scheduler/DAGScheduler/" },
  schedInternals: { label: "The Internals of Spark Core · Scheduler", url: "https://books.japila.pl/apache-spark-internals/scheduler/" },
  catalyst: { label: "Databricks · Deep Dive into Catalyst Optimizer", url: "https://www.databricks.com/blog/2015/04/13/deep-dive-into-spark-sqls-catalyst-optimizer.html" },
  codegen: { label: "Databricks · Spark as a Compiler (Whole-Stage Codegen)", url: "https://www.databricks.com/blog/2016/05/23/apache-spark-as-a-compiler-joining-a-billion-rows-per-second-on-a-laptop.html" },
  tungsten: { label: "Databricks · Project Tungsten", url: "https://www.databricks.com/blog/2015/04/28/project-tungsten-bringing-spark-closer-to-bare-metal.html" },
  sqlPerf: { label: "Spark Docs · SQL Performance Tuning", url: "https://spark.apache.org/docs/latest/sql-performance-tuning.html" },
  aqe: { label: "Databricks · Adaptive Query Execution", url: "https://www.databricks.com/blog/2020/05/29/adaptive-query-execution-speeding-up-spark-sql-at-runtime.html" },
  ss: { label: "Spark Docs · Structured Streaming Guide", url: "https://spark.apache.org/docs/3.5.6/structured-streaming-programming-guide.html" },
  ssKafka: { label: "Spark Docs · Structured Streaming + Kafka Integration", url: "https://spark.apache.org/docs/latest/streaming/structured-streaming-kafka-integration.html" }
};

const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "Architecture",
    difficulty: "easy",
    question: "Which component negotiates resources with the cluster manager and schedules tasks across executors?",
    options: ["The driver program", "An executor", "The cluster manager itself", "The worker node's OS scheduler"],
    answer: 0,
    explanation: "The driver hosts the SparkContext, which requests resources from the cluster manager and, via the DAGScheduler/TaskScheduler, decides which tasks run where.",
    reference: REF.cluster
  },
  {
    id: 2,
    category: "Architecture",
    difficulty: "easy",
    question: "Where does the actual execution of transformations on data (running task code against a partition) take place?",
    options: ["On the driver", "On executors", "On the cluster manager master", "On the HDFS NameNode"],
    answer: 1,
    explanation: "Executors are JVM processes on worker nodes that run tasks and hold data in memory/disk for the application. The driver coordinates but doesn't process partitions itself.",
    reference: REF.cluster
  },
  {
    id: 3,
    category: "Architecture",
    difficulty: "easy",
    question: "Which of these is NOT a cluster manager Spark can run on natively?",
    options: ["YARN", "Kubernetes", "Mesos", "Docker Swarm"],
    answer: 3,
    explanation: "Spark ships support for Standalone, YARN, Kubernetes, and (historically) Mesos. Docker Swarm has never been a supported Spark cluster manager.",
    reference: REF.cluster
  },
  {
    id: 4,
    category: "Architecture",
    difficulty: "medium",
    question: "What does spark.executor.cores primarily control?",
    options: [
      "The total number of executors launched",
      "The number of tasks an executor can run concurrently",
      "The JVM heap size of the executor",
      "The number of partitions in the input data"
    ],
    answer: 1,
    explanation: "Each core an executor is given can run one task slot at a time, so spark.executor.cores sets the executor's task-level parallelism, not its memory or the app's total executor count.",
    reference: REF.config
  },
  {
    id: 5,
    category: "Architecture",
    difficulty: "easy",
    question: "In Spark standalone mode, what is a 'worker node'?",
    options: [
      "A machine that hosts one or more executor processes for applications",
      "The machine that runs the driver",
      "The standalone cluster's master/scheduler process",
      "A dedicated HDFS storage node"
    ],
    answer: 0,
    explanation: "A worker is a standalone-mode daemon running on a cluster machine; it launches and supervises executor processes on behalf of applications assigned to it by the master.",
    reference: REF.cluster
  },
  {
    id: 6,
    category: "Architecture",
    difficulty: "easy",
    question: "Which process holds the SparkContext/SparkSession and runs the user's main() method?",
    options: ["The executor", "The driver", "The cluster manager", "The shuffle service"],
    answer: 1,
    explanation: "The driver is the process running your application's main function; it creates the SparkSession/SparkContext and builds the logical plan of your job.",
    reference: REF.cluster
  },
  {
    id: 7,
    category: "Jobs, Stages & Tasks",
    difficulty: "easy",
    question: "A Spark job is triggered when you call:",
    options: ["A transformation like map()", "An action like collect() or count()", "spark-submit", "SparkSession.builder()"],
    answer: 1,
    explanation: "Transformations are lazy and only build up a logical plan. A job is only actually submitted to the DAGScheduler when an action forces computation.",
    reference: REF.rdd
  },
  {
    id: 8,
    category: "Jobs, Stages & Tasks",
    difficulty: "medium",
    question: "Stage boundaries within a Spark job are determined by:",
    options: [
      "The number of partitions in the RDD",
      "Wide (shuffle) dependencies between RDDs",
      "The number of actions called",
      "The number of executors available"
    ],
    answer: 1,
    explanation: "The DAGScheduler cuts a new stage whenever it hits a wide dependency that requires a shuffle; narrow dependencies can be pipelined within a single stage.",
    reference: REF.dagInternals
  },
  {
    id: 9,
    category: "Jobs, Stages & Tasks",
    difficulty: "easy",
    question: "What is a Spark 'task'?",
    options: [
      "A synonym for a stage",
      "The smallest unit of work, executing one partition's computation on one executor core",
      "An action such as collect()",
      "A physical query plan"
    ],
    answer: 1,
    explanation: "A task is the unit actually scheduled onto an executor slot; a stage is made up of many tasks, typically one per partition of the stage's output.",
    reference: REF.rdd
  },
  {
    id: 10,
    category: "Jobs, Stages & Tasks",
    difficulty: "medium",
    question: "Which component turns the logical DAG of RDD dependencies into a set of stages?",
    options: ["The TaskScheduler", "The DAGScheduler", "The Catalyst optimizer", "The BlockManager"],
    answer: 1,
    explanation: "The DAGScheduler is stage-oriented: it examines RDD lineage, splits it at shuffle boundaries into stages, and submits stages (as TaskSets) once their dependencies are ready.",
    reference: REF.dagInternals
  },
  {
    id: 11,
    category: "Jobs, Stages & Tasks",
    difficulty: "medium",
    question: "Which component actually launches tasks on executors and handles retrying failed tasks?",
    options: ["The DAGScheduler", "The TaskScheduler", "The SparkContext", "The ContextCleaner"],
    answer: 1,
    explanation: "The TaskScheduler (backed by a scheduler backend, e.g. for YARN or Kubernetes) takes TaskSets from the DAGScheduler, assigns tasks to executors respecting locality, and resubmits failed tasks.",
    reference: REF.schedInternals
  },
  {
    id: 12,
    category: "Jobs, Stages & Tasks",
    difficulty: "medium",
    question: "How do narrow transformations (map, filter) differ from wide transformations (groupByKey, join)?",
    options: [
      "Narrow transformations always require a shuffle, wide ones never do",
      "Each output partition of a narrow transformation depends on only one input partition, while wide transformations depend on many",
      "Narrow transformations run only on the driver",
      "There is no meaningful scheduling difference"
    ],
    answer: 1,
    explanation: "Narrow dependencies (1-to-1 or bounded) can be pipelined without moving data between nodes. Wide dependencies need data from many input partitions, which forces a shuffle and a new stage.",
    reference: REF.rdd
  },
  {
    id: 13,
    category: "Shuffle",
    difficulty: "medium",
    question: "What kind of operation triggers a shuffle in Spark?",
    options: [
      "Any transformation at all",
      "Operations that need to redistribute data across the cluster by key, like groupByKey, reduceByKey, or join",
      "Calling collect()",
      "Calling cache()"
    ],
    answer: 1,
    explanation: "A shuffle is needed whenever records with the same key must end up co-located, which happens for grouping, many joins, and repartition-by-key style operations.",
    reference: REF.rdd
  },
  {
    id: 14,
    category: "Shuffle",
    difficulty: "medium",
    question: "By default, where are the intermediate map-output files of a shuffle written?",
    options: ["To HDFS", "To the local disk of the executor that produced them", "Directly into driver memory", "To S3"],
    answer: 1,
    explanation: "Map tasks write shuffle output to local disk on the executor; reduce tasks then fetch the relevant blocks over the network (or via an external shuffle service).",
    reference: REF.config
  },
  {
    id: 15,
    category: "Shuffle",
    difficulty: "easy",
    question: "In the Spark UI, what do 'shuffle write' and 'shuffle read' refer to?",
    options: [
      "Shuffle write is data written by map tasks for later fetching; shuffle read is data fetched by the downstream (reduce-side) tasks",
      "The reverse — write is what reduce tasks do, read is what map tasks do",
      "Both refer only to network bytes transferred, never disk",
      "These terms don't appear in the Spark UI"
    ],
    answer: 0,
    explanation: "Shuffle write is the output a stage's tasks persist to disk for the next stage; shuffle read is what the next stage's tasks pull in from those files.",
    reference: REF.tuning
  },
  {
    id: 16,
    category: "Shuffle",
    difficulty: "hard",
    question: "Which shuffle implementation became Spark's default (replacing hash-based shuffle) starting with Spark 1.2?",
    options: ["Tungsten shuffle", "Sort-based shuffle", "Bucketed shuffle", "Broadcast shuffle"],
    answer: 1,
    explanation: "Sort-based shuffle writes a single sorted, indexed output file per map task instead of many small per-reducer files, dramatically reducing file-handle and I/O overhead versus hash shuffle.",
    reference: REF.tuning
  },
  {
    id: 17,
    category: "Shuffle",
    difficulty: "medium",
    question: "Why is reduceByKey generally more efficient than groupByKey followed by a map/reduce step?",
    options: [
      "reduceByKey avoids shuffling entirely",
      "reduceByKey performs a map-side partial combine before shuffling, reducing the volume of data moved",
      "reduceByKey doesn't require a Partitioner",
      "groupByKey uses less memory on the reduce side"
    ],
    answer: 1,
    explanation: "reduceByKey can pre-aggregate values for a key on the map side before the shuffle, whereas groupByKey ships every value across the network first and aggregates afterward.",
    reference: REF.rdd
  },
  {
    id: 18,
    category: "Shuffle",
    difficulty: "medium",
    question: "What does a 'shuffle spill' mean?",
    options: [
      "Data was lost because a shuffle failed",
      "In-memory shuffle data exceeded the available execution memory and was spilled to disk",
      "A network packet was dropped mid-shuffle",
      "Shuffle output was written directly to S3 instead of local disk"
    ],
    answer: 1,
    explanation: "When sorting/aggregating shuffle data can't fit in the memory Spark has allotted, it spills sorted runs to disk and merges them later — correct behavior, but a common performance red flag.",
    reference: REF.tuning
  },
  {
    id: 19,
    category: "Catalyst Optimizer",
    difficulty: "medium",
    question: "Catalyst's optimizations operate on which representation of a DataFrame/Dataset query?",
    options: [
      "The raw RDD lineage graph",
      "Trees of logical and physical plan nodes built from Catalyst expressions",
      "Compiled JVM bytecode directly",
      "The physical layout of files on disk"
    ],
    answer: 1,
    explanation: "Catalyst represents queries as trees (unresolved logical plan → resolved logical plan → optimized logical plan → physical plan) and applies rule- and cost-based transformations to those trees.",
    reference: REF.catalyst
  },
  {
    id: 20,
    category: "Catalyst Optimizer",
    difficulty: "medium",
    question: "What is the correct order of phases in Catalyst's query optimization pipeline?",
    options: [
      "Analysis → Logical Optimization → Physical Planning → Code Generation",
      "Parsing → Execution → Analysis",
      "Physical Planning → Analysis → Logical Optimization",
      "Code Generation → Analysis → Physical Planning"
    ],
    answer: 0,
    explanation: "SQL/DataFrame text is first parsed, then Analysis resolves names against the catalog, Logical Optimization applies rule-based rewrites, Physical Planning chooses execution strategies, and whole-stage code generation produces the final executable code.",
    reference: REF.catalyst
  },
  {
    id: 21,
    category: "Catalyst Optimizer",
    difficulty: "easy",
    question: "'Predicate pushdown' is an optimization where:",
    options: [
      "Filters are pushed as close to the data source as possible to avoid reading unnecessary data",
      "Join order is rearranged based on statistics",
      "Code generation is moved earlier in the pipeline",
      "Partitions are pushed onto specific executors"
    ],
    answer: 0,
    explanation: "By pushing filter predicates down into the scan (and into formats like Parquet that support it), Spark can skip reading rows or even whole row-groups/files that can't match.",
    reference: REF.catalyst
  },
  {
    id: 22,
    category: "Catalyst Optimizer",
    difficulty: "hard",
    question: "What does 'whole-stage code generation' (part of Project Tungsten) do?",
    options: [
      "Fuses multiple physical operators into a single generated function, cutting virtual-function-call and boxing overhead",
      "Generates the bytecode that runs on the cluster manager",
      "Compiles Python UDFs into native machine code",
      "Generates the shuffle files themselves"
    ],
    answer: 0,
    explanation: "Instead of the classic Volcano-style iterator model where each operator calls next() on the one below it, whole-stage codegen collapses a chain of operators into one tight generated method, much like hand-written loop code.",
    reference: REF.codegen
  },
  {
    id: 23,
    category: "Catalyst Optimizer",
    difficulty: "medium",
    question: "Which Catalyst phase resolves unbound column and table references against the catalog?",
    options: ["The Optimizer", "The Analyzer", "The Physical Planner", "The Code Generator"],
    answer: 1,
    explanation: "The Analyzer takes the parser's unresolved logical plan and, using catalog/metadata info, resolves attribute and relation references, producing a resolved logical plan.",
    reference: REF.catalyst
  },
  {
    id: 24,
    category: "Catalyst Optimizer",
    difficulty: "medium",
    question: "Constant folding, predicate pushdown, and column pruning are all examples of:",
    options: [
      "Physical planning strategies",
      "Rule-based logical plan optimizations",
      "Code generation techniques",
      "Shuffle-level optimizations"
    ],
    answer: 1,
    explanation: "These are classic rule-based rewrites Catalyst applies to the logical plan before a physical plan is even chosen.",
    reference: REF.catalyst
  },
  {
    id: 25,
    category: "Tungsten & Memory",
    difficulty: "medium",
    question: "Project Tungsten's goals include all of the following EXCEPT:",
    options: [
      "Off-heap memory management using sun.misc.Unsafe-style access",
      "A cache-friendly binary row format (UnsafeRow)",
      "Whole-stage code generation",
      "Automatic hyperparameter tuning for MLlib models"
    ],
    answer: 3,
    explanation: "Tungsten is about CPU and memory efficiency at the execution-engine level — memory layout, serialization, and codegen. Hyperparameter tuning is unrelated to Tungsten.",
    reference: REF.tungsten
  },
  {
    id: 26,
    category: "Tungsten & Memory",
    difficulty: "medium",
    question: "Spark's Unified Memory Manager divides usable executor JVM memory primarily into which two regions?",
    options: [
      "Storage memory and execution memory",
      "Driver memory and executor memory",
      "On-heap memory and off-heap memory only",
      "Shuffle memory and cache memory"
    ],
    answer: 0,
    explanation: "Since Spark 1.6, storage (for caching/broadcast) and execution (for shuffles, joins, sorts, aggregations) share one unified region of the JVM heap instead of two rigidly separate pools.",
    reference: REF.tuning
  },
  {
    id: 27,
    category: "Tungsten & Memory",
    difficulty: "hard",
    question: "Under the Unified Memory Manager, if execution needs more memory and storage is using space beyond its guaranteed minimum, what happens?",
    options: [
      "Execution can evict cached storage blocks up to a configurable boundary",
      "The task always fails with an OutOfMemoryError",
      "Storage memory can never be reclaimed by execution",
      "The extra data is spilled straight to HDFS automatically"
    ],
    answer: 0,
    explanation: "Storage memory is elastic: execution can reclaim (evict) cached blocks it isn't guaranteed, down to the floor set by spark.memory.storageFraction, so shuffles/joins don't starve just because the cache is using idle space.",
    reference: REF.tuning
  },
  {
    id: 28,
    category: "Tungsten & Memory",
    difficulty: "hard",
    question: "What in-memory row format does Tungsten use to avoid per-object JVM overhead and enable direct binary operations?",
    options: ["JSON objects", "UnsafeRow, a compact binary row layout", "Avro GenericRecord", "Python pickled objects"],
    answer: 1,
    explanation: "UnsafeRow packs fields into a raw byte layout (with an offset/null-bitmap header) so Spark can compare, hash, and copy rows without materializing individual JVM objects per field.",
    reference: REF.tungsten
  },
  {
    id: 29,
    category: "Tungsten & Memory",
    difficulty: "easy",
    question: "Why is Kryo serialization often preferred over Java serialization in Spark?",
    options: [
      "Kryo is mandatory for DataFrame operations",
      "Kryo produces more compact serialized data and serializes/deserializes faster",
      "Kryo only works with RDDs, never with objects",
      "Java serialization was removed from recent Spark versions"
    ],
    answer: 1,
    explanation: "Kryo is a faster, more space-efficient serializer than Java's built-in one, which is why Spark recommends registering Kryo (spark.serializer) for RDD-heavy workloads with custom objects.",
    reference: REF.tuning
  },
  {
    id: 30,
    category: "Tungsten & Memory",
    difficulty: "medium",
    question: "What does spark.executor.memoryOverhead account for?",
    options: [
      "Extra heap memory reserved purely for RDD caching",
      "Off-heap memory used by JVM overhead, native libraries, and other non-JVM processes inside the executor container",
      "Memory reserved on the driver only",
      "A buffer used exclusively for network shuffle reads"
    ],
    answer: 1,
    explanation: "Cluster managers like YARN/Kubernetes allocate container memory as executor heap + memoryOverhead, covering things like JVM metaspace, native buffers, and Python worker processes for PySpark.",
    reference: REF.config
  },
  {
    id: 31,
    category: "Joins",
    difficulty: "medium",
    question: "Spark's optimizer will automatically use a broadcast hash join when:",
    options: [
      "Both tables being joined are large",
      "One side of the join is estimated to be smaller than spark.sql.autoBroadcastJoinThreshold (default 10MB)",
      "The tables already share the same partitioning",
      "It's always used for outer joins"
    ],
    answer: 1,
    explanation: "If one side's estimated size is under the broadcast threshold, Catalyst ships that whole side to every executor and avoids a shuffle entirely for the larger side.",
    reference: REF.sqlPerf
  },
  {
    id: 32,
    category: "Joins",
    difficulty: "medium",
    question: "What precondition does a sort-merge join rely on before merging the two sides?",
    options: [
      "Both sides must be broadcast to every executor",
      "Both sides must be shuffled/partitioned and sorted by the join key",
      "One side must already be cached",
      "No shuffle is needed at all"
    ],
    answer: 1,
    explanation: "Sort-merge join co-partitions both sides by the join key (via a shuffle if not already partitioned that way), sorts each partition, and then walks both sorted streams together.",
    reference: REF.sqlPerf
  },
  {
    id: 33,
    category: "Joins",
    difficulty: "medium",
    question: "What problem does data skew cause in a shuffle-based join?",
    options: [
      "It increases available parallelism",
      "A small number of tasks end up processing disproportionately large partitions, becoming stragglers that dominate the stage's runtime",
      "It reduces the total volume of data being shuffled",
      "It disables broadcast joins entirely"
    ],
    answer: 1,
    explanation: "If a few keys are far more frequent than others, the partitions/tasks handling those keys balloon in size while other tasks finish quickly — the stage waits on the slowest ('straggler') task.",
    reference: REF.sqlPerf
  },
  {
    id: 34,
    category: "Joins",
    difficulty: "hard",
    question: "Which technique mitigates join skew by splitting a hot key into several sub-keys using a random prefix/suffix?",
    options: ["Broadcast join", "Salting", "Bucketing", "coalesce()"],
    answer: 1,
    explanation: "Salting artificially spreads a skewed key's rows across multiple synthetic keys (and duplicates the small side accordingly), so no single task is overloaded by one dominant key.",
    reference: REF.sqlPerf
  },
  {
    id: 35,
    category: "Joins",
    difficulty: "hard",
    question: "How does a shuffle hash join differ from a sort-merge join?",
    options: [
      "It builds an in-memory hash table on one (shuffled) side instead of sorting both sides",
      "It never involves a shuffle",
      "It has been the default join strategy since Spark 2.3",
      "It only works when one side is broadcast"
    ],
    answer: 0,
    explanation: "Shuffle hash join still co-partitions both sides by key via a shuffle, but then builds a hash table on the smaller shuffled side rather than sorting — useful when that side fits in memory but is too big to broadcast.",
    reference: REF.sqlPerf
  },
  {
    id: 36,
    category: "Joins",
    difficulty: "hard",
    question: "With Adaptive Query Execution (AQE) enabled, Spark can convert a planned sort-merge join into which strategy at runtime if actual stats show one side is small?",
    options: ["A broadcast hash join", "A cartesian join", "A nested-loop join only", "A nested-loop join always"],
    answer: 0,
    explanation: "AQE re-checks actual shuffle output sizes at stage boundaries and can switch a sort-merge join to a broadcast join if the real (not estimated) size of one side turns out to be small enough.",
    reference: REF.aqe
  },
  {
    id: 37,
    category: "Caching",
    difficulty: "easy",
    question: "RDD.cache() is shorthand for persisting at which storage level?",
    options: ["MEMORY_ONLY", "MEMORY_AND_DISK", "DISK_ONLY", "MEMORY_ONLY_SER"],
    answer: 0,
    explanation: "For the RDD API, cache() is exactly persist(StorageLevel.MEMORY_ONLY). (Note: the DataFrame/Dataset API's .cache() instead defaults to MEMORY_AND_DISK.)",
    reference: REF.rdd
  },
  {
    id: 38,
    category: "Caching",
    difficulty: "easy",
    question: "How does persist() differ from cache()?",
    options: [
      "persist() lets you choose a specific StorageLevel, while cache() always applies a fixed default level",
      "They are unrelated operations",
      "cache() doesn't survive across stages, persist() does",
      "persist() forces immediate materialization, cache() is always lazy with no exceptions"
    ],
    answer: 0,
    explanation: "cache() is just a convenience call to persist() with a preset default storage level; persist() lets you pick things like MEMORY_AND_DISK_SER or DISK_ONLY explicitly.",
    reference: REF.rdd
  },
  {
    id: 39,
    category: "Caching",
    difficulty: "easy",
    question: "What happens when you call unpersist() on a cached RDD/DataFrame?",
    options: [
      "The underlying source data is deleted",
      "Its cached blocks are removed from memory/disk and marked eligible for garbage collection",
      "Its lineage information is destroyed, so it can no longer be recomputed",
      "Nothing happens until the SparkSession is stopped"
    ],
    answer: 1,
    explanation: "unpersist() frees the storage blocks Spark was holding for that RDD/DataFrame; the lineage remains, so Spark can still recompute it from scratch if referenced again.",
    reference: REF.rdd
  },
  {
    id: 40,
    category: "Caching",
    difficulty: "medium",
    question: "Which storage level serializes objects before storing them, trading extra CPU work for a smaller memory footprint?",
    options: ["MEMORY_ONLY", "MEMORY_ONLY_SER", "DISK_ONLY", "OFF_HEAP"],
    answer: 1,
    explanation: "MEMORY_ONLY_SER stores data as serialized byte arrays rather than live JVM objects, cutting memory usage (and GC pressure) at the cost of serialize/deserialize overhead on access.",
    reference: REF.rdd
  },
  {
    id: 41,
    category: "Structured Streaming",
    difficulty: "medium",
    question: "By default, Spark Structured Streaming processes incoming data using:",
    options: ["Per-record continuous processing", "Micro-batches", "A single monolithic batch job", "Purely event-driven callbacks with no batching"],
    answer: 1,
    explanation: "The default trigger runs a series of small batch jobs against whatever new data has arrived since the last batch — that's the micro-batch execution model.",
    reference: REF.ss
  },
  {
    id: 42,
    category: "Structured Streaming",
    difficulty: "medium",
    question: "What role does checkpointing (including the write-ahead log) play in Structured Streaming?",
    options: [
      "It stores only the final output results",
      "It persists source offsets and operator state so the query can recover and continue exactly-once after a failure",
      "It replaces the need for a driver process",
      "It is only relevant to batch DataFrames, not streaming ones"
    ],
    answer: 1,
    explanation: "Checkpoints record which offsets have been processed and the state of stateful operators, letting a restarted query resume from exactly where it left off instead of reprocessing or dropping data.",
    reference: REF.ss
  },
  {
    id: 43,
    category: "Structured Streaming",
    difficulty: "medium",
    question: "What is a watermark used for in Structured Streaming?",
    options: [
      "Encrypting data in transit",
      "Bounding how late arriving data can be, so old state for stateful aggregations can be finalized and dropped",
      "Increasing the number of shuffle partitions automatically",
      "Caching all historical data indefinitely"
    ],
    answer: 1,
    explanation: "A watermark tells Spark 'I don't expect data older than X relative to the max event time seen so far,' which lets it safely evict state for windows that are no longer expected to receive updates.",
    reference: REF.ss
  },
  {
    id: 44,
    category: "Structured Streaming",
    difficulty: "hard",
    question: "Spark's experimental Continuous Processing mode (introduced in 2.3) targets what kind of latency, compared to the default micro-batch engine?",
    options: [
      "The same latency as micro-batch",
      "Millisecond-level end-to-end latency, versus the ~100ms-or-more typical of micro-batch",
      "Higher latency, but stronger consistency guarantees",
      "It removes the need for checkpointing altogether"
    ],
    answer: 1,
    explanation: "Continuous Processing runs long-lived tasks that process records as they arrive instead of in discrete batches, aiming for roughly millisecond latencies at the cost of a more restricted operator set.",
    reference: REF.ss
  },
  {
    id: 45,
    category: "Structured Streaming",
    difficulty: "medium",
    question: "Structured Streaming's Kafka source tracks offsets within Spark's own checkpoint rather than relying on:",
    options: ["The old receiver-based, Zookeeper-managed offset tracking", "The Kafka broker's disk", "Spark's DAGScheduler", "The Catalyst optimizer"],
    answer: 0,
    explanation: "Unlike the legacy DStream receiver approach that committed offsets to Zookeeper, the Structured Streaming Kafka source reads offset ranges directly and durably tracks progress in Spark's checkpoint location, giving exactly-once semantics without Zookeeper involvement.",
    reference: REF.ssKafka
  },
  {
    id: 46,
    category: "Adaptive Query Execution",
    difficulty: "medium",
    question: "Adaptive Query Execution (AQE), GA since Spark 3.0, uses runtime statistics to do all of the following EXCEPT:",
    options: [
      "Coalesce many small shuffle partitions into fewer, larger ones",
      "Dynamically switch join strategies based on actual (not estimated) data sizes",
      "Optimize skewed joins by splitting oversized skewed partitions",
      "Statically compile Python UDFs into JVM bytecode"
    ],
    answer: 3,
    explanation: "AQE re-plans shuffle partitioning, join strategy, and skew handling using runtime stats gathered at stage boundaries. It has nothing to do with compiling Python UDFs to JVM bytecode, which isn't something Spark does.",
    reference: REF.sqlPerf
  },
  {
    id: 47,
    category: "Adaptive Query Execution",
    difficulty: "hard",
    question: "What triggers AQE to re-optimize a query plan mid-execution?",
    options: [
      "It re-plans after every single task finishes",
      "It re-optimizes at materialization points — stage boundaries — once shuffle/broadcast exchange output statistics are available",
      "It never re-plans once execution starts",
      "It only applies when reading from RDDs directly"
    ],
    answer: 1,
    explanation: "AQE can only act on real numbers once a shuffle or broadcast exchange has actually run, so it re-optimizes the remaining plan at those exchange boundaries rather than continuously.",
    reference: REF.aqe
  },
  {
    id: 48,
    category: "Adaptive Query Execution",
    difficulty: "easy",
    question: "What does the spark.sql.adaptive.enabled configuration control?",
    options: ["Whether AQE is turned on", "Whether RDD caching is turned on", "Whether dynamic partition pruning is turned on", "Whether Catalyst runs at all"],
    answer: 0,
    explanation: "This is the master switch for Adaptive Query Execution; it's true by default in modern Spark 3.x releases.",
    reference: REF.sqlPerf
  },
  {
    id: 49,
    category: "Fault Tolerance",
    difficulty: "medium",
    question: "How does speculative execution help Spark jobs?",
    options: [
      "It runs a duplicate copy of a slow-running ('straggler') task on another executor and uses whichever copy finishes first",
      "It always runs two attempts of every task for redundancy, regardless of speed",
      "It replaces the need for checkpointing",
      "It disables automatic task retries"
    ],
    answer: 0,
    explanation: "When spark.speculation is enabled, Spark watches for tasks running much slower than their peers in the same stage and launches a backup copy elsewhere, taking whichever result lands first.",
    reference: REF.config
  },
  {
    id: 50,
    category: "Fault Tolerance",
    difficulty: "medium",
    question: "How does RDD checkpointing differ from simply caching an RDD?",
    options: [
      "Checkpointing writes the RDD's data to reliable storage (e.g. HDFS/S3) and truncates its lineage, removing the need to recompute it from source on failure",
      "Checkpointing is identical to caching but faster",
      "Checkpointing only works with DataFrames, never RDDs",
      "Checkpointing happens automatically after every action with no configuration"
    ],
    answer: 0,
    explanation: "Caching keeps data in memory/disk on the executors but preserves lineage for recompute; checkpointing durably persists data to reliable storage and cuts the lineage graph, so a node failure can't force an expensive recomputation from the original source.",
    reference: REF.rdd
  }
];

// Allow use both as a browser global (index.html) and, if ever needed, as a module.
// Explicitly attach to window: top-level `const` does NOT become a window
// property the way `var` does, so this line is required for the app script
// below (which reads window.QUIZ_QUESTIONS) to actually see the data.
if (typeof window !== "undefined") {
  window.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = QUIZ_QUESTIONS;
}

